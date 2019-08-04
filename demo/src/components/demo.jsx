import React from "react";
import Autocomplete from "material-ui-autocomplete";

const data = [
  { label: "Afghanistan" },
  { label: "Aland Islands" },
  { label: "Albania" },
  { label: "Algeria" },
  { label: "American Samoa" },
  { label: "Andorra" },
  { label: "Angola" },
  { label: "Anguilla" },
  { label: "Antarctica" },
  { label: "Antigua and Barbuda" },
  { label: "Argentina" },
  { label: "Armenia" },
  { label: "Aruba" },
  { label: "Australia" },
  { label: "Austria" },
  { label: "Azerbaijan" },
  { label: "Bahamas" },
  { label: "Bahrain" },
  { label: "Bangladesh" },
  { label: "Barbados" },
  { label: "Belarus" },
  { label: "Belgium" },
  { label: "Belize" },
  { label: "Benin" },
  { label: "Bermuda" },
  { label: "Bhutan" },
  { label: "Bolivia, Plurinational State of" },
  { label: "Bonaire, Sint Eustatius and Saba" },
  { label: "Bosnia and Herzegovina" },
  { label: "Botswana" },
  { label: "Bouvet Island" },
  { label: "Brazil" },
  { label: "British Indian Ocean Territory" },
  { label: "Brunei Darussalam" }
].map(suggestion => ({
  value: suggestion.label,
  label: suggestion.label
}));

export default class Demo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: null
    };

    setTimeout(() => {
      this.setState({
        selected: {
          value: "Botswana",
          label: "Botswana"
        }
      });
    }, 2000);
  }

  handleChange = selection => {
    this.setState({ selected: selection });
  };

  render() {
    return (
      <div>
        <Autocomplete
          data={data}
          onChange={this.handleChange}
          selected={this.state.selected}
          label="Countries"
          placeholder="Countries"
        />
      </div>
    );
  }
}
