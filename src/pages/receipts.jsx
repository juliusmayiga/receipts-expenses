import React, {Component} from 'react';
import ReceiptEntry from "../components/receipt-entry/receipt-entry";

class Receipts extends Component {
    state = {
        receipts: [
            {
                description: '',
                amount: '',
                amountInCAD: 0,
                currency: 'CAD'
            }
        ],
        receiptTemplate: {
            description: '',
            amount: '',
            amountInCAD: 0,
            currency: 'CAD'
        },
        supportedCurrencies: [
            'CAD',
            'USD'
        ]
    };


    onFieldChange = (event, index, field) => {
        let receipts = [...this.state.receipts];
        receipts[index][field] = event.target.value;
        this.setState({receipts: receipts});
    }

    addEntry = () => {
        if (this.state.receipts.length < 5) {
            let receipts = [...this.state.receipts];
            receipts.push({...this.state.receiptTemplate});
            this.setState({receipts: receipts});
        }
    }

    removeEntry = () => {
        if (this.state.receipts.length > 1) {
            let receipts = [...this.state.receipts];
            receipts.pop();
            this.setState({receipts: receipts});
        }
    }

    render() {
        let thisPage = this;
        let receipts = this.state.receipts.map(function(receipt, index) {
            return <ReceiptEntry key={index}
                                 data={receipt}
                                 onChange={thisPage.onFieldChange}
                                 index={index} supportedCurrencies={thisPage.state.supportedCurrencies}/>
        });
        return (
            <div>
                <h1>Receipts & Expenses</h1>
                {receipts}
                <button onClick={this.addEntry}>Add Entry</button>
                <button onClick={this.removeEntry}>Remove Entry</button>
                <hr/>
                <button type="submit">Submit</button>
            </div>
        );
    }
}

export default Receipts;