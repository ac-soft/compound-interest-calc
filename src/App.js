import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import './App.css';

/* Materialize css */
import 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';

/* Chart.js */
import { Bar } from 'react-chartjs-2';

const Header = (props) => {
  return (
    <div className="card teal darken-4">
      <div className="card-content white-text">
        <span className="card-title">Compound Interest Calculator</span>
      </div>
    </div>
  );
};

const Footer = (props) => {
  return (
    <div style={{fontSize: '11px'}}>
      <hr />
      <span><p><b>Interactive Application using ES6 with React</b></p></span>
      <span><p>© 2019 Copyright APC</p></span>
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
      <hr />
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
      backgroundColor: 'rgba(75, 192, 192, 0.4)',
      borderColor: 'rgb(75, 192, 192)',
      borderWidth: 1,
      data: chartInvested
    }, {
      label: 'Interest',
      backgroundColor: 'rgba(54, 162, 235, 0.4)',
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
  let idx = props.output.length - 1;

  return (
    <div className="App-result">
      <ResultHeader years={ idx } total={ props.output[idx].totalValue }/>

      <div>
        <div className="row" style={{textAlign: 'left', fontSize: '12px'}}>
          <div className="col s3">
            Total investment :
            <br />
            Total interest :
          </div>
          <div className="col s9">
            <NumberFormat 
              value={ props.output[idx].totalDeposit } 
              displayType={ 'text' } 
              thousandSeparator={true}
              prefix={ '$' }
              decimalScale={ 2 }
              fixedDecimalScale={ true }>  
            </NumberFormat>
            <br />
            <NumberFormat 
              value={ props.output[idx].totalInterest } 
              displayType={ 'text' } 
              thousandSeparator={true}
              prefix={ '$' }
              decimalScale={ 2 }
              fixedDecimalScale={ true }>  
            </NumberFormat>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col s12">
            <ResultChart output={ props.output }/>
          </div>
        </div>
      </div>
    </div>
  ); 
};

class InputDetails extends Component {
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

  getCurrentYear = () => {
    return new Date().getFullYear();
  };

  calcYearValues = () => {
    let tmp = [];
    
    let sumInterest = 0;
    let amt = this.state.initialAmount ? this.state.initialAmount : 0;
    let dep = this.state.annualDeposit ? this.state.annualDeposit : 0;
    let yrs = this.state.yearsToGrow ? this.state.yearsToGrow : 0;
    let int = this.state.interest ? this.state.interest : 0;

    let tYearString = (new Date()).getFullYear();

    if (yrs > 100) {
      console.log("Maximum of 100 years");
      yrs = 100;
    }
  
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

    this.setState(prevState => ({
      [name]: value,
    }), this.calcYearValues);
  }

  render() {
    return (
      <div className="row">
        <div className="col s3">
          <form>
            <div className="row">
              <div className="input-field">
                <input 
                  id="initialAmount"
                  defaultValue={ this.state.initialAmount }
                  onChange={ this.handleChange } 
                  type="number"
                  className="validate" />
                <label htmlFor="initialAmount">Initial Investment ($)</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field">
                <input 
                  id="annualDeposit" 
                  defaultValue={ this.state.annualDeposit } 
                  onChange={ this.handleChange } 
                  type="number" 
                  className="validate" />
                <label htmlFor="annualDeposit">Annual Addition ($)</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field">
                <input 
                  id="interest" 
                  defaultValue={ this.state.interest } 
                  onChange={ this.handleChange } 
                  type="number" 
                  className="validate" />
                <label htmlFor="interest">Interest Rate (%)</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field">
                <input 
                  id="yearsToGrow" 
                  defaultValue={ this.state.yearsToGrow } 
                  onChange={ this.handleChange } 
                  type="number" 
                  className="validate" />
                <label htmlFor="yearsToGrow">Years To Grow</label>
              </div>
            </div>
          </form>
        </div>
        <div className="col s9">
          <Result output={ this.state.output }/>
        </div>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <InputDetails />
        <Footer />
      </div>
    );
  }
}

export default App;
