import React from "react";
import PropTypes from "prop-types";
import deburr from "lodash/deburr";
import Downshift from "downshift";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import InputAdornment from "@material-ui/core/InputAdornment";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";

function renderInput(inputProps) {
    const {
        InputProps,
        classes,
        ref,
        toggleButtonProps,
        toggleMenu,
        ...other
    } = inputProps;

    return (
        <TextField
            variant="outlined"
            InputProps={{
                inputRef: ref,
                classes: {
                    root: classes.inputRoot,
                    input: classes.inputInput
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <ArrowDropDown
                      className={classes.toggleButton}
                      {...toggleButtonProps}
                      onClick={toggleMenu}
                    />
                  </InputAdornment>
                ),
                ...InputProps
            }}
            {...other}
        />
    );
}

renderInput.propTypes = {
    classes: PropTypes.object.isRequired,
    InputProps: PropTypes.object
};

function renderSuggestion(suggestionProps) {
    const {
        suggestion,
        index,
        itemProps,
        highlightedIndex,
        selectedItem
    } = suggestionProps;
    const isHighlighted = highlightedIndex === index;
    const isSelected =
        ((selectedItem && selectedItem.label) || "").indexOf(suggestion.label) > -1;

    return (
        <MenuItem
            {...itemProps}
            key={suggestion.label}
            selected={isSelected}
            component="div"
            style={{
                fontWeight: isHighlighted ? 500 : 400
            }}
        >
            {suggestion.label}
        </MenuItem>
    );
}

renderSuggestion.propTypes = {
    highlightedIndex: PropTypes.oneOfType([
        PropTypes.oneOf([null]),
        PropTypes.number
    ]).isRequired,
    index: PropTypes.number.isRequired,
    itemProps: PropTypes.object.isRequired,
    selectedItem: PropTypes.string.isRequired,
    suggestion: PropTypes.shape({
        label: PropTypes.string.isRequired
    }).isRequired
};

function getSuggestions(data, value, { showEmpty = false, showFullMenu } = {}) {
    const inputValue = deburr(value.trim()).toLowerCase();
    const inputLength = inputValue.length;

    if (showFullMenu) return data;

    return inputLength === 0 && !showEmpty
        ? []
        : data.filter(suggestion => {
            const keep =
                suggestion.label
                    .toLocaleLowerCase()
                    .indexOf(inputValue.toLocaleLowerCase()) >= 0;

            return keep;
        });
}

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        height: 250
    },
    container: {
        flexGrow: 1,
        position: "relative"
    },
    paper: {
        position: "absolute",
        zIndex: 1,
        marginTop: theme.spacing(1),
        left: 0,
        right: 0,
        maxHeight: 500,
        overflowY: "auto"
    },
    inputRoot: {
        flexWrap: "wrap"
    },
    inputInput: {
        width: "auto",
        flexGrow: 1
    },
    toggleButton: {
        cursor: "pointer"
    }
}));

export default function Autocomplete(props) {
    const classes = useStyles();
    const [showFullMenu, setShowFullMenu] = React.useState(true);

    return (
        <div className={classes.root}>
            <Downshift
                id="downshift-options"
                scrollIntoView={node => {
                    node && node.scrollIntoView();
                }}
                onChange={selection => {
                    if (selection) {
                        props.onChange(selection);
                    }
                }}
                selectedItem={props.selected}
                itemToString={item => item.label}
            >
                {({
                    getInputProps,
                    getItemProps,
                    getLabelProps,
                    getMenuProps,
                    getToggleButtonProps,
                    highlightedIndex,
                    inputValue,
                    isOpen,
                    openMenu,
                    closeMenu,
                    selectedItem,
                    setHighlightedIndex
                }) => {
                    const { onBlur, onFocus, ...inputProps } = getInputProps({
                        onFocus: () => {
                            setShowFullMenu(true);
                            openMenu();

                            const selectedIndex = props.data.findIndex(
                                d => d.value === props.selected.value
                            );
                            setHighlightedIndex(selectedIndex);
                        },
                        onKeyDown: event => {
                            if (event.keyCode === 27) {
                                // Escape
                                event.preventDefault();
                                event.stopPropagation();
                            }
                            if (
                                event.keyCode === 8 || // Backspace
                                event.keyCode === 46 || // Delete
                                (event.keyCode >= 48 && event.keyCode <= 90) || // Characters
                                (event.keyCode >= 96 && event.keyCode <= 111) ||
                                (event.keyCode >= 186 && event.keyCode <= 222)
                            )
                                setShowFullMenu(false);
                        },
                        placeholder: props.placeholder
                    });

                    return (
                        <div className={classes.container}>
                            {renderInput({
                                fullWidth: true,
                                classes,
                                label: props.label,
                                InputLabelProps: getLabelProps({ shrink: true }),
                                InputProps: { onBlur, onFocus },
                                inputProps,
                                toggleButtonProps: { ...getToggleButtonProps() },
                                toggleMenu: () => {
                                    if (isOpen) {
                                        closeMenu();
                                    } else {
                                        setShowFullMenu(true);
                                        openMenu();
                                    }
                                }
                            })}

                            <div {...getMenuProps()}>
                                {isOpen ? (
                                    <Paper className={classes.paper} square>
                                        {getSuggestions(props.data, inputValue, {
                                            showEmpty: true,
                                            showFullMenu: showFullMenu
                                        }).map((suggestion, index) =>
                                            renderSuggestion({
                                                suggestion,
                                                index,
                                                itemProps: getItemProps({ item: suggestion }),
                                                highlightedIndex,
                                                selectedItem
                                            })
                                        )}
                                    </Paper>
                                ) : null}
                            </div>
                        </div>
                    );
                }}
            </Downshift>
        </div>
    );
}

Autocomplete.propTypes = {
    data: PropTypes.array,
    onChange: PropTypes.func,
    selected: PropTypes.object,
    label: PropTypes.string,
    placeholder: PropTypes.string
}