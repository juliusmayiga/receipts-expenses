import React from 'react';

const DropdownSelect = (props) =>  {
    let options = props.options.map(function (option, index) {
        return <option key={index} value={option}>{option}</option>
    });

    return (
        <select name={props.name}
                onChange={props.onChange}
                value={props.defaultValue}>
            {options}
        </select>
    );
}

export default DropdownSelect;