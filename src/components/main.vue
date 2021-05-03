<template>
  <div id="main">
    <img id = "topLogo" alt="VFT Defi Farmer" src="../assets/farmer.png">
    <h1> {{ msg }}</h1>
    <br>
    <div id = "infoBox">
      <p> Note that you need to install and activate an extension like 'Allow CORS: Access-Control-Allow-Origin' </p>
      <p> in your browser for the app to work correctly: <a href="https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf">Chrome</a>
        or <a href="https://addons.mozilla.org/de/firefox/addon/access-control-allow-origin/">Firefox</a> </p>
    </div>
    <br>
    <button @click="updateData"> Update data</button>
    <br>
    <br>
    <div id = "stats">
      <div>
        <div id = "tokenStats" class = "statsBox">
          <p> Token stats:</p>
          <div>
            <span class = "tokenText"> Market Cap:</span> <span> {{tokenStats["marketcap"]}} HIVE </span>
            <br>
            <span class = "tokenText"> VFT Minted:</span> <span> {{tokenStats["totalSupply"]}} </span>
            <br>
            <span class = "tokenText"> VFT Burned:</span> <span> {{tokenStats["burned"]}} </span>
            <br>
            <span class = "tokenText"> %Burned:</span> <span> {{formatNumber(tokenStats["burned"] * 100 /
              tokenStats["totalSupply"])}}% </span>
            <br>
            <span class = "tokenText"> New VFT/Day:</span> <span> {{tokenStats["inflationRate"]}} </span>
            <br>
          </div>
        </div> <!-- End token stats-->

        <div  id = "inflationStats" class = "statsBox">
          <p> Daily VFT inflation: </p>
          <div>
            <span class = "tokenText"> HIVE:</span> <span> {{ tokenStats["inflationRate"] * inflationStats['SWAP.HIVE'] / 100}} ({{inflationStats['SWAP.HIVE']}}%) </span>
            <br>
            <span class = "tokenText"> VIBES:</span> <span> {{ tokenStats["inflationRate"] * inflationStats['VIBES'] / 100}} ({{inflationStats['VIBES']}}%) </span>
            <br>
            <span class = "tokenText"> VFT:</span> <span> {{ tokenStats["inflationRate"] * inflationStats['VFT'] / 100}} ({{inflationStats['VFT']}}%) </span>
            <br>
            <span class = "tokenText"> LEO:</span> <span> {{ tokenStats["inflationRate"] * inflationStats['LEO'] / 100}} ({{inflationStats['LEO']}}%) </span>
            <br>
            <span class = "tokenText"> DEC:</span> <span> {{ tokenStats["inflationRate"] * inflationStats['DEC'] / 100}} ({{inflationStats['DEC']}}%) </span>
            <br>
            <span class = "tokenText"> STARBITS:</span> <span> {{ tokenStats["inflationRate"] * inflationStats['STARBITS'] / 100}} ({{inflationStats['STARBITS']}}%) </span>
            <br>
            <br>
          </div>
        </div> <!-- End inflation stats-->

        <div id = "depositStats" class = "statsBox">
          <p> Total deposited funds: </p>
          <div>
            <span class = "tokenText"> HIVE:</span> <span> {{ formatNumber(depositStats['SWAP.HIVE']) }} </span>
            <br>
            <span class = "tokenText"> VIBES:</span> <span> {{ formatNumber(depositStats['VIBES']) }} </span>
            <br>
            <span class = "tokenText"> VFT:</span> <span> {{ formatNumber(depositStats['VFT']) }} </span>
            <br>
            <span class = "tokenText"> LEO:</span> <span> {{ formatNumber(depositStats['LEO']) }} </span>
            <br>
            <span class = "tokenText"> DEC:</span> <span> {{ formatNumber(depositStats['DEC']) }} </span>
            <br>
            <span class = "tokenText"> STARBITS:</span> <span> {{ formatNumber(depositStats['STARBITS']) }} </span>
            <br>
          </div>
        </div> <!-- End deposit stats-->

        <div id = "aprStats" class = "statsBox">
          <p> Current APR: </p>
          <div>
            <span class = "tokenText"> HIVE:</span> <span> {{formatNumber(aprStats['SWAP.HIVE'])}}% </span>
            <br>
            <span class = "tokenText"> VIBES:</span> <span> {{formatNumber(aprStats['VIBES'])}}% </span>
            <br>
            <span class = "tokenText"> VFT:</span> <span> {{formatNumber(aprStats['VFT'])}}% </span>
            <br>
            <span class = "tokenText"> LEO:</span> <span> {{formatNumber(aprStats['LEO'])}}% </span>
            <br>
            <span class = "tokenText"> DEC:</span> <span> {{formatNumber(aprStats['DEC'])}}% </span>
            <br>
            <span class = "tokenText"> STARBITS:</span> <span> {{formatNumber(aprStats['STARBITS'])}}% </span>
            <br>
          </div>
        </div> <!-- End deposit stats-->
      </div>
    </div> <!-- End stats -->
    <br>
    <div id = "infoBanner">
      <span class = "tokenText"> VFT Price:</span> <span> {{ Number.parseFloat(tokenPrices["VFT"]).toFixed(3)}} HIVE | </span>
      <span class = "tokenText"> TVL :</span> <span> {{ Number.parseFloat(tokenStats["tvl"]).toFixed(1)}} HIVE | </span>
      <span class = "tokenText"> TVL/MC Ration :</span> <span> {{ Number.parseFloat(tokenStats["tvl"] / tokenStats["marketcap"]).toFixed(2)}} </span>
    </div> <!-- End info Banner-->
  </div>
</template>

<script>
import $ from 'jquery'

// Initting vars
let ssc
let msg = "VFTLAB Farming Stats"

// available token pools
const tokens = ['SWAP.HIVE', 'VIBES', 'STARBITS', 'LEO', 'DEC', 'VFT']

// saves pooled token amounts
// depositStats[token]
let depositStats = {}

// saves stats about the token
// tokenStats["totalSupply"], tokenStats["burned"], tokenStats["marketcap"], tokenStats["inflationRate"], tokenStats["tvl"]
let tokenStats = {}

// save the inflation distribution
// inflationStats[token]
let inflationStats = {}

// save apr rates
// aprStats[token]
let aprStats = {}

// save prices of tokens in hive
// tokenPrices[token]
let tokenPrices = {}

document.addEventListener("DOMContentLoaded", function(){
  $.when(
      $.getScript( "https://cdn.jsdelivr.net/npm/sscjs@latest/dist/ssc.min.js" ),
      $.getScript( "https://unpkg.com/axios/dist/axios.min.js" ),
      $.getScript( "https://cdn.jsdelivr.net/npm/@hiveio/hive-js/dist/hive.min.js" ),
      $.Deferred(function( deferred ){
        $( deferred.resolve );
      })
  ).then(function(){
    // eslint-disable-next-line no-undef
    ssc = new SSC('https://api.hive-engine.com/rpc')
  }).done(function () {
    init()
  })
});
function init() {
  updateData()
}

// Updates tokens deposited to the pools
// depositStats objects stores the values
function getDepositedTokens() {
  // Get native Hive balance
  // eslint-disable-next-line no-undef
  hive.api.callAsync('condenser_api.get_accounts', [['vftlab']])
      .then(function (result) {
        depositStats["SWAP.HIVE"] = parseFloat((result[0].balance).split(" "))
      }).then(function () {
    // Get HE balances
    ssc.find(
        'tokens',
        'balances',
        {
          account:  'vftlab'
        }, (result) => {
          // eslint-disable-next-line no-undef
          resolve(result)
        }).then(function (result) {
      for (let token of result) {
        if (token.symbol == "SWAP.HIVE") continue;
        let tokenbal = token.balance
        depositStats[token.symbol] = tokenbal
      }
      //TODO Add correct Hive value (get from Hive directly, not HE)
    }).then(function () {
      getAPRStats() //TODO Fix async shit later
      getTVL()
    })
  })
}

// get Stats about the VFT token itself
function getTokenStats() {
  // VFT supply
  ssc.findOne(
      'tokens',
      'tokens',
      {
        symbol:  'VFT'
        // eslint-disable-next-line no-unused-vars
      }, () => {
        // resolve(result)
      }).then(function (result) {
        tokenStats["totalSupply"] = formatNumber(result.supply)
        getMarketCap()
        })
  // VFT burned
  ssc.findOne(
      'tokens',
      'balances',
      {
        account:  'null',  // tokens in null == token burned
        symbol: 'VFT'
        // eslint-disable-next-line no-unused-vars
      }, (result) => {
        // resolve(result)
      }).then(function (result) {
         tokenStats["burned"] = formatNumber(result.balance)
    })

  // Get inflation rate
  $.get('https://vftlab.herokuapp.com/stats/').then(function(result) {
    if (result) {
      tokenStats["inflationRate"] = result.data.stats.new_vft_block
    }
  }).always(function () {
    getTokenPrices()
  });
}

// sets the market cap in tokenStats["marketcap"]; called in getTokenStats()
function getMarketCap() {
  // Market Cap in HIVE using last trading price
  ssc.findOne(
      'market',
      'metrics',
      {
        symbol:  'VFT'
        // eslint-disable-next-line no-unused-vars
      }, (result) => {
      }).then(function (result) {
    tokenStats["marketcap"] = formatNumber(result.lastPrice * (tokenStats["totalSupply"] - tokenStats["burned"]))
  })
}

// get the distribution of the inflation
function getInflationStats() {
  $.get('https://vftlab.herokuapp.com/getMonedas/').then(function (result) {
    if (result) {
      for (let token of result.data.monedas) {
        inflationStats[token.coind_name] = token.pool
      }
    }
  })
}

// calculate the aprs for the tokens
function  getAPRStats() {
    for (let token of tokens) {
      let depositsValue = depositStats[token] * tokenPrices[token]
      let vftYield = inflationStats[token] * (tokenStats["inflationRate"] / 100)
      let yieldValue = vftYield * tokenPrices["VFT"]
      let dailyAPR = yieldValue / depositsValue * 100
      aprStats[token] = dailyAPR * 365
      // console.log("Token: " + token + "\t" + depositStats[token] + "\t"+ tokenPrices[token])
    }
}

function getTokenPrices() {
  for (let token of tokens) {
    if (token == "SWAP.HIVE") {
      tokenPrices["SWAP.HIVE"] = 1
      continue;
    }
    ssc.findOne(
        'market',
        'metrics',
        {
          symbol:  token
        }, () => {
        }).then(function (result) {
      tokenPrices[token] = result.lastPrice
    }).then(function () {
      getDepositedTokens()
    })
  }
}

function getTVL() {
  let tvl = 0;
  for (let token of tokens) {
    tvl += tokenPrices[token] * depositStats[token]
  }
  tokenStats["tvl"] = tvl
}

// Updates all numbers
function updateData() {
  getTokenStats()
  // getTokenPrices() Is called in getTokenStats
  // getDepositedTokens() Is called in getTokenPrices
  // getAPRStats() Is called in getDepositedTokens
  getInflationStats()
}

// Creates a dummy object for the token amounts object to pass on page load
function createTokenAmountsObj() {
  for (let token of tokens) {
    depositStats[token] = 0
  }
  return depositStats
}

// Creates a dummy object for the token stats object to pass on page load
function createTokenStatsObj() {
  tokenStats["totalSupply"] = 0
  tokenStats["burned"] = 0
  tokenStats["marketcap"] = 0
  tokenStats["inflationRate"] = 1000
  tokenStats["tvl"] = 0
  return tokenStats
}

function createInflationStatsObj() {
  inflationStats["VIBES"] = 30
  inflationStats["VFT"] = 20
  inflationStats["SWAP.HIVE"] = 20
  inflationStats["LEO"] = 12.5
  inflationStats["DEC"] = 12.5
  inflationStats["STARBITS"] = 5
  return inflationStats
}

function createAPRStatsObj() {
  for (let token of tokens) {
    aprStats[token] = 0
  }
  return aprStats
}

function createTokenPricesObj() {
  for (let token of tokens) {
    tokenPrices[token] = 0
  }
  tokenPrices["HIVE"] = 1
  tokenPrices["SWAP.HIVE"] = 1
  return tokenPrices
}

// rounds number and adds space after each block of 3 numbers
function formatNumber(n) {
  // round to 0 decimal places
    n = Number.parseFloat(n).toFixed(0)
  // add space.
  // n = n.replace(new RegExp("^(\\d{" + (n.length%3?n.length%3:0) + "})(\\d{3})", "g"),
  //   "$1 $2").replace(/(\d{3})+?/gi, "$1 ").trim();
  return n
}


export default {
  name: 'HelloWorld',
  data() {
    return {
      msg: msg,
      tokenStats: createTokenStatsObj(),
      inflationStats: createInflationStatsObj(),
      depositStats: createTokenAmountsObj(),
      aprStats: createAPRStatsObj(),
      tokenPrices: createTokenPricesObj()
    }
  },
  methods: {
    updateData,
    formatNumber
  },
  mounted() {
    let axiosscript = document.createElement('script')
    axiosscript.setAttribute('src', 'https://unpkg.com/axios/dist/axios.min.js')
    document.head.appendChild(axiosscript)
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

html {
  background-image: url("../assets/landscape.png");
}

h1{
  color: black;
  text-shadow: 1px 1px white;
}

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

#stats {
  -webkit-text-size-adjust: 100%;
  font-family: Verdana,sans-serif;
  line-height: 1.5;
  color: #000!important;
  box-sizing: inherit;
  border-radius: 16px;
  padding: 5px 0;
  border: 1px solid black;
  width: max-content;

  max-height: 90%;
  margin: auto;
  overflow: hidden;
  border-spacing: 5px 0;
  background: rgba(0, 0, 0, 0.5);
  font-size: 1.05em;
  align-items: center;
  display: flex;
  justify-content: center;
}

.statsBox {
  border: 1px solid red;
  border-radius: 16px;
  display: table-cell;
  padding: 0.2em 16px;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.8);
  margin: 0 auto;
}

.tokenText {
  font-size: 1.05em;
  color: mediumblue;
}

p {
  font-weight: bold;
}

button {
  align-items: center;
  background-color: rgb(170, 137, 41);
  border: 0;
  border-radius: 16px;
  box-shadow: 0 0 7px 3px rgba(0,0,0,0.8);
  color: rgb(255, 255, 255);
  display: inline-flex;
  font-weight: 600;
  height: 50px;
  outline: 0;
  padding: 0 24px;
  transition: background-color 0.2s ease 0s;
  opacity: 1;
  margin-top: 5px;
}
button:hover {
  background-color: rgb(170, 100, 10);
}

#topLogo {
  margin-top: 5px;
}

#infoBox {
  margin: 0 auto;
  border: 1px solid red;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.8);
  width: max-content;
  padding: 5px;
}

#infoBanner {
  color: #000;
  margin: 0 auto;
  border: 1px solid black;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.8);
  width: max-content;
  padding: 5px;
  font-weight: bold;
  font-size: large;
 }
</style>
