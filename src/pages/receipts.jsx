import React, {Component} from 'react';
import ReceiptEntry from "../components/receipt-entry/receipt-entry";
import Http from "../Http";
import {
    FIELD_AMOUNT,
    FIELD_CURRENCY,
    FIELD_BASE_CURRENCY_AMOUNT,
    FIELD_DESCRIPTION
} from "../site-constants";
import DropdownSelect from "../components/dropdown-select/dropdown-select";

class Receipts extends Component {
    state = {
        receipts: [],
        rates: {},
        baseCurrency: 'CAD',
        maxAmount: 1000.00,
        maxReceipts: 5
    };

    getReceiptTemplate() {
        let receiptTemplate = {};
        receiptTemplate[FIELD_DESCRIPTION] = '';
        receiptTemplate[FIELD_AMOUNT] = '';
        receiptTemplate[FIELD_BASE_CURRENCY_AMOUNT] = 0;
        receiptTemplate[FIELD_CURRENCY] = this.state.baseCurrency;
        return receiptTemplate;
    }

    componentDidMount() {
        this.fetchCurrencyRates(true).then(
            () => {
                this.setState({receipts: [this.getReceiptTemplate()]})
            }
        );
    }

    fetchCurrencyRates = (cache) => {
        /**
         * End Point /exchangeratesapi/?base=CAD is a wrapper of https://api.exchangeratesapi.io/latest?base=CAD
         * This was done to get around CORS since https://api.exchangeratesapi.io/ doesnt allow
         * the pre-flight OPTIONS calls
         */
        return Http.get( 'exchangeratesapi/?base=' + this.state.baseCurrency, { cache: cache })
            .then(
            response => {
                let currencyData = response.data;
                this.setState({rates: currencyData.rates});
            }
        ).catch(
            (reason) => {}
        );
    }

    computeCurrencyConversion = (receipt) => {
        receipt[FIELD_BASE_CURRENCY_AMOUNT] = receipt[FIELD_AMOUNT] / this.state.rates[receipt[FIELD_CURRENCY]]
        receipt[FIELD_BASE_CURRENCY_AMOUNT] = receipt[FIELD_BASE_CURRENCY_AMOUNT].toFixed(2);
        return receipt;
    }

    currencyConversion = (receipts, index) => {
        this.fetchCurrencyRates(true).then(
            () => {
                receipts[index] = this.computeCurrencyConversion(receipts[index]);
                this.setState({receipts: receipts});
            }
        );
    }

    onFieldChange = (event, index, field) => {
        let receipts = [...this.state.receipts];
        receipts[index][field] = event.target.value;

        if (FIELD_DESCRIPTION !== field) {
            this.currencyConversion(receipts, index);
        }
        else {
            this.setState({receipts: receipts});
        }
    }

    addEntry = (event) => {
        event.preventDefault();

        if (this.state.receipts.length < this.state.maxReceipts) {
            let receipts = [...this.state.receipts];
            receipts.push(this.getReceiptTemplate());
            this.setState({receipts: receipts});
        }
    }

    removeEntry = (event) => {
        event.preventDefault();

        if (this.state.receipts.length > 1) {
            let receipts = [...this.state.receipts];
            receipts.pop();
            this.setState({receipts: receipts});
        }
    }

    totalBaseCurrencyAmount = () => {
        let totalAMount = 0;

        if (this.state.receipts.length > 0) {
            totalAMount = this.state.receipts
                .map((receipt) => parseFloat(receipt[FIELD_BASE_CURRENCY_AMOUNT]))
                .reduce((previous, current) => previous + current);
        }

        return totalAMount;
    }

    submitHandler = (event) => {
        event.preventDefault();
        console.log(this.state.receipts);
    }

    changeBaseCurrency = (event) => {
        let thisPage = this;
        this.setState({baseCurrency: event.target.value},
            () => {
                this.fetchCurrencyRates(false).then(
                    () => {
                        let receipts = [...this.state.receipts];
                        receipts = receipts.map((receipt, index) => {
                            return thisPage.computeCurrencyConversion(receipts[index]);
                        });
                        this.setState({receipts: receipts});
                    }
                )
            }
        );

    }

    render() {
        let thisPage = this;
        let totalBaseCurrencyAmount = this.totalBaseCurrencyAmount();
        let supportedCurrencies = Object.keys(thisPage.state.rates);
        let receipts = this.state.receipts.map((receipt, index) => {
            return <ReceiptEntry key={index}
                                 data={receipt}
                                 onChange={thisPage.onFieldChange}
                                 index={index}
                                 baseCurrency={this.state.baseCurrency}
                                 supportedCurrencies={supportedCurrencies}/>
        });

        let addBtnAttributes = (this.state.receipts.length < this.state.maxReceipts
            && totalBaseCurrencyAmount < this.state.maxAmount) ? {} : {disabled: 'disabled'};
        let removeBtnAttributes = (this.state.receipts.length > 1) ? {} : {disabled: 'disabled'};
        let submitBtnAttributes = (totalBaseCurrencyAmount <= this.state.maxAmount) ? {} : {disabled: 'disabled'};

        return (
            <form className="form-container">
                <div className="top-right-container">
                    Change Base Currency:
                    <DropdownSelect name="baseCurrencyPreference"
                                    onChange={(event) => this.changeBaseCurrency(event)}
                                    defaultValue={this.state.baseCurrency}
                                    options={supportedCurrencies} />
                </div>
                <h1 className="title">Expenses</h1>
                <p>Enter receipt(s) details</p>
                <ul>
                    <li><small>You can not submit an amount over <b>{this.state.baseCurrency} {this.state.maxAmount.toFixed(2)}</b></small></li>
                    <li><small>You can only submit a maximum of <b>{this.state.maxReceipts}</b> expenses</small></li>
                </ul>
                {receipts}
                <hr/>
                <button className="button"
                        type="button"
                        onClick={(event) => this.addEntry(event)}
                        {...addBtnAttributes}>Add Entry</button>
                <button className="button"
                        type="button"
                        onClick={(event) => this.removeEntry(event)}
                        {...removeBtnAttributes}>Remove Entry</button>
                <button className="button"
                        type="submit"
                        onClick={(event) => this.submitHandler(event)}
                        {...submitBtnAttributes}>Submit</button>
            </form>
        );
    }
}

export default Receipts;