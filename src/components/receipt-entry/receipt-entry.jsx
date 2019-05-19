import React from 'react';

const ReceiptEntry = (props) =>  {
    let supportedCurrenciesOptions = props.supportedCurrencies.map(function (currency, index) {
        return <option key={index} value={currency}>{currency}</option>
    });
    return (
        <div>
            <input type="text"
                   name={"receipt[" + props.index + "]['description']"}
                   value={props.data.description}
                   placeholder="Description"
                   onChange={(event) => props.onChange(event, props.index, 'description')}/>

            <input type="number"
                   name={"receipt[" + props.index + "]['ammount']"}
                   value={props.data.amount}
                   placeholder="Amount"
                   onChange={(event) => props.onChange(event, props.index, 'amount')}/>

            <select name={"receipt[" + props.index + "]['currency']"}
                    onChange={(event) => props.onChange(event, props.index, 'currency')}>
                {supportedCurrenciesOptions}
            </select>
        </div>
    );
}

export default ReceiptEntry;