import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import './App.css';

/* Materialize css */
import 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';

/* Chart.js */
import { Bar } from 'react-chartjs-2';

/* React-notify-toast */
import Notifications, { notify } from 'react-notify-toast';

const Header = (props) => {
  return (
    <header>
      <div className="row teal darken-4 white-text card">
        <div className="col s1">
        </div>
        <div className="col s10">
          <h5>Compound Interest Calculator</h5>
        </div>
        <div className="col s1">
          <img src="./ApcLogo.png" alt="Apc" length="55px" width="55px"></img>
        </div>
      </div>
    </header>
  );
};

const Footer = (props) => {
  return (
    <div style={{fontSize: '11px'}}>
      <hr />
      <span><p><b>Interactive Application using ES6 with React</b></p></span>
      <span><p>© 2019 Copyright AC-Soft</p></span>
    </div>
  );
};

const ResultHeader = (props) => {
  let hdr;

  if (props.years > 1) {
    hdr = 
      <p>
        You will have <b>
          <NumberFormat 
            value={ props.total } 
            displayType={ 'text' } 
            thousandSeparator={ true }
            prefix={ '$' }
            decimalScale={ 2 }
            fixedDecimalScale={ true }>  
          </NumberFormat>
        </b> in <b>{ props.years } years!</b>
      </p>;
  } else if (props.years === 1) {
    hdr = 
      <p>
        You will have <b>
          <NumberFormat 
            value={ props.total } 
            displayType={ 'text' } 
            thousandSeparator={ true }
            prefix={ '$ ' }
            decimalScale={ 2 }
            fixedDecimalScale={ true }>  
          </NumberFormat> next year!
        </b>
      </p>;
  } else {
    hdr = <p>Calculate your investment returns</p>;
  }

  return (
    <div style={{fontSize: '14px'}}>
      { hdr }
    </div>
  );
};

const ResultChart = (props) => {
  /* Get specific values from props */
  let chartLabels = props.output.map(i => i.year);
  let chartInvested = props.output.map(i => i.totalDeposit);
  let chartInterest = props.output.map(i => i.totalInterest);

  let data = {
    labels: chartLabels,
    datasets: [{
      label: 'Investment',
      backgroundColor: 'rgba(75, 192, 192, 0.7)',
      borderColor: 'rgb(75, 192, 192)',
      borderWidth: 1,
      data: chartInvested
    }, {
      label: 'Interest',
      backgroundColor: 'rgba(54, 162, 235, 0.7)',
      borderColor: 'rgb(54, 162, 235)',
      borderWidth: 1,
      data: chartInterest
    }]
  };

  let options = {
    scales: {
      xAxes: [{ stacked: true }],
      yAxes: [{ stacked: true }]
    },
    /* From stackoverflow */
    /* https://stackoverflow.com/questions/39373561/how-get-sum-of-total-values-in-stackedbar-chartjs */
    tooltips: {
      mode: 'label',
      callbacks: {
        label: function(tooltipItem, data) {
          let tooltipLabel = data.datasets[tooltipItem.datasetIndex].label;
          let tooltipValue = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];

          // Loop through all datasets to get the actual total of the index
          let total = 0;
          for (let i = 0; i < data.datasets.length; i++)
              total += data.datasets[i].data[tooltipItem.index];

          // If it is not the last dataset, you display it as you usually do
          if (tooltipItem.datasetIndex !== data.datasets.length - 1) {
              return tooltipLabel + ": $" + tooltipValue.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
          } else { // .. else, you display the dataset and the total, using an array
              return [tooltipLabel + ": $" + tooltipValue.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'), 
                "Total: $" + total.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')];
          }
        }
      }
    }
  };

  return (
    <div>
      <Bar data={ data } options={ options }></Bar>
    </div>
  );
};

const Result = (props) => {
  return (
    <div>
      <div className="row" style={{textAlign: 'left', fontSize: '12px'}}>
        <div className="col s3">
          Total investment :
          <br />
          Total interest :
        </div>
        <div className="col s9">
          <NumberFormat 
            value={ props.totalDeposit } 
            displayType={ 'text' } 
            thousandSeparator={true}
            prefix={ '$' }
            decimalScale={ 2 }
            fixedDecimalScale={ true }>  
          </NumberFormat>
          <br />
          <NumberFormat 
            value={ props.totalInterest } 
            displayType={ 'text' } 
            thousandSeparator={true}
            prefix={ '$' }
            decimalScale={ 2 }
            fixedDecimalScale={ true }>  
          </NumberFormat>
        </div>
      </div>
    </div>
  ); 
};

const InputDetails = (props) => {
  return (
    <form>
      <div className="row">
        <div className="input-field">
          <input 
            id="initialAmount"
            defaultValue={ props.initialAmount }
            onChange={ props.handleChange } 
            type="number"
            className="validate" 
            min="0" />
          <label htmlFor="initialAmount">Initial Amount ($)</label>
        </div>
      </div>
      <div className="row">
        <div className="input-field">
          <input 
            id="annualDeposit" 
            defaultValue={ props.annualDeposit } 
            onChange={ props.handleChange } 
            type="number" 
            className="validate"
            min="0" />
          <label htmlFor="annualDeposit">Annual Addition ($)</label>
        </div>
      </div>
      <div className="row">
        <div className="input-field">
          <input 
            id="interest" 
            defaultValue={ props.interest } 
            onChange={ props.handleChange } 
            type="number" 
            className="validate"
            min="0" />
          <label htmlFor="interest">Interest Rate (%)</label>
        </div>
      </div>
      <div className="row">
        <div className="input-field">
          <input 
            id="yearsToGrow" 
            defaultValue={ props.yearsToGrow } 
            onChange={ props.handleChange } 
            type="number" 
            className="validate"
            min="0" />
          <label htmlFor="yearsToGrow">Years To Grow</label>
        </div>
      </div>
    </form>
  );
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialAmount: null,
      annualDeposit: null,
      interest: null,
      yearsToGrow: null,
      output: [{
        year: 'Start',
        totalDeposit: 0,
        totalInterest: 0,
        totalValue: 0
      }],
    };

    this.handleChange = this.handleChange.bind(this);
  }

  calcYearValues = () => {
    let tmp = [];
    
    let sumInterest = 0;
    let amt = this.state.initialAmount ? this.state.initialAmount : 0;
    let dep = this.state.annualDeposit ? this.state.annualDeposit : 0;
    let yrs = this.state.yearsToGrow ? this.state.yearsToGrow : 0;
    let int = this.state.interest ? this.state.interest : 0;

    let tYearString = (new Date()).getFullYear();
  
    for(let i = 0; i <= yrs; i++) {
      if (i === 0) {
        tmp = tmp.concat({
          year: "Start",
          totalDeposit: (Number(amt)),
          totalInterest: 0,
          totalValue: (Number(amt))
        });
      } else {
        let tDeposit = Number(tmp[i - 1].totalDeposit) + Number(dep);
        sumInterest = sumInterest + (Number(tmp[i - 1].totalValue) * (int / 100));
        let tInterest = sumInterest;
        let tTotal = Number(tDeposit) + Number(tInterest);
        

        tmp = tmp.concat({
          year: (Number(tYearString) + Number(i)),
          totalDeposit: tDeposit,
          totalInterest: tInterest,
          totalValue: tTotal
        });
      }
    }
    
    this.setState({
      output: tmp
    });
  };

  handleChange(event) {
    let name = event.target.id;
    let value = event.target.value;

    /* Validation here */
    if (value < 0) {
      notify.show('Please enter a positive value', 'warning');
      return;
    } else if (name === "yearsToGrow" && value > 100) {
      notify.show('Years to grow has a maximum value of 100', 'warning');
      value = 100;
    }

    this.setState(prevState => ({
      [name]: value,
    }), this.calcYearValues);
  };

  render() {
    let idx = this.state.output.length - 1;

    return (
      <div className="App">
        <Notifications />
        <Header />
        <div className="row">
          <div className="col s3">
            <InputDetails 
              initialAmount={ this.state.initialAmount }
              annualDeposit={ this.state.annualDeposit }
              interest={ this.state.interest }
              yearsToGrow={ this.state.yearsToGrow }
              handleChange={ this.handleChange }/>
          </div>
          <div className="col s9">
            <div className="App-result">
              <ResultHeader years={ idx } total={ this.state.output[idx].totalValue }/>
              <hr />
              <Result 
                totalDeposit={ this.state.output[idx].totalDeposit } 
                totalInterest={ this.state.output[idx].totalInterest }/>
              <hr />
              <ResultChart output={ this.state.output }/>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
