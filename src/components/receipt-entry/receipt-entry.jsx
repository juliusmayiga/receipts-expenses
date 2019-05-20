import React from 'react';
import {FIELD_AMOUNT, FIELD_CURRENCY, FIELD_BASE_CURRENCY_AMOUNT, FIELD_DESCRIPTION} from "../../site-constants";
import DropdownSelect from "../dropdown-select/dropdown-select";

const ReceiptEntry = (props) =>  {
    return (
        <div className="receipt-entry">
            <input type="text"
                   name={"receipts[" + props.index + "]['" + FIELD_DESCRIPTION + "']"}
                   value={props.data[FIELD_DESCRIPTION]}
                   placeholder="Description"
                   onChange={(event) => props.onChange(event, props.index, FIELD_DESCRIPTION)}/>

            <input type="number"
                   name={"receipts[" + props.index + "]['" + FIELD_AMOUNT + "']"}
                   value={props.data[FIELD_AMOUNT]}
                   min="0"
                   step="0.01"
                   placeholder="Amount"
                   onChange={(event) => props.onChange(event, props.index, FIELD_AMOUNT)}/>
            <DropdownSelect name={"receipts[" + props.index + "]['" + FIELD_AMOUNT + "']"}
                            onChange={(event) => props.onChange(event, props.index, FIELD_CURRENCY)}
                            defaultValue={props.data[FIELD_CURRENCY]}
                            options={props.supportedCurrencies} />
            <span className="left-inline-block">{props.baseCurrency}</span>
            <span className="right-inline-block">
                {props.data[FIELD_BASE_CURRENCY_AMOUNT]}
            </span>
        </div>
    );
}

export default ReceiptEntry;