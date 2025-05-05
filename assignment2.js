async function getQuote() {
    const quoteData = await fetch("https://zenquotes.io/api/random")
    .then((result) => result.json());

    return quoteData[0];    
}

async function populateQuote() {
    const quote = await getQuote();
    document.getElementById("quote").innerHTML = `"${quote.q}"`;
    console.log(`Quote is: ${quote.q}`);
    document.getElementById("author").innerHTML = `${quote.a}`;
    console.log(`Author is: ${quote.a}`);
}

window.onload = populateQuote;


async function getDog() {
    const response = await fetch("https://dog.ceo/api/breeds/image/random");
    const dogData = await response.json();
    return dogData;
}

async function populateDogImage() {
    const slider = document.getElementById('slider'); // Make sure to use `const`
    for (let i = 0; i < 10; i++) {
        const doggo = await getDog();
        const image = document.createElement('img');
        image.src = doggo.message;
        image.alt = 'Random Dog Image';
        image.width = 600;
        image.height = 600;

        console.log(`Loaded image: ${doggo.message}`);
        slider.appendChild(image);
    }

   
    simpleslider.getSlider();
}


populateDogImage();

async function getDogBreeds() {
    const dogBreedData = await fetch("https://dogapi.dog/api/v2/breeds")
    .then((result) => result.json());

    return dogBreedData;
}

async function populateDogBreedButtons() {
    const container = document.getElementById('dogBreeds')
    const data = await getDogBreeds();
    const breeds = data.data;

    breeds.forEach(breed => {
        const button = document.createElement('button');
        button.textContent = breed.attributes.name;
        button.setAttribute('class', 'breedButton');

        button.addEventListener('click', () => {populateDogBreedContainer(breed)})

        container.appendChild(button);
    });
}



populateDogBreedButtons()

async function populateDogBreedContainer(breed) {
    const container = document.getElementById('dogBreedBox')
    const data = await getDogBreeds();
    const breeds = data.data;

    container.innerHTML = `
        <div id='breedInfo'>
            <h1>Name: ${breed.attributes.name}</h1>
            <h3>Description: ${breed.attributes.description}</h3>
            <h3>Min Life: ${breed.attributes.life.min}</h3>
            <h3>Max Life: ${breed.attributes.life.max}</h3>
        </div>
    `;
}



function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

async function stocks() {
    const form = document.querySelector('#stocksForm')

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const days = parseInt(document.getElementById('daysSelect').value);
        const ticker = document.getElementById('stockInput').value.toUpperCase();

        const endDate = new Date();
        console.log(endDate)
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);
        console.log(startDate)

        const stocksData = await fetch(`https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${formatDate(startDate)}/${formatDate(endDate)}?adjusted=true&sort=asc&limit=120&apiKey=enI0nLsP1upi4vvBFiFGVsKh4GbfcTXK`)
        .then((result) => result.json());
        console.log('fetching stocks')

        const dates = []
        const prices = []

        stocksData.results.forEach(({t, c}) => {
            dates.push(new Date(t).toLocaleDateString());
            prices.push(c);
        })

        chartContainer = document.getElementById('chartContainer')
        chartContainer.innerHTML = ''

        const chart = document.createElement('canvas');
        chart.setAttribute('id', 'myChart');
        chartContainer.appendChild(chart)

        const ctx = document.getElementById('myChart');

        new Chart(ctx, {
            type: 'line',
            data: {
              labels: dates,
              datasets: [{
                label: `${ticker} Stock Price`,
                data: prices,
                borderWidth: 1
              }]
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }
          });
    })

    
}

stocks()

async function stocksTable() {
    const postData = await fetch('https://tradestie.com/api/v1/apps/reddit?date=2022-04-03')
    .then((result) => result.json())

    const sortedPostData = postData.sort((a, b) => b.no_of_comments - a.no_of_comments);
    console.log(sortedPostData)
    const topFivePosts = sortedPostData.slice(0, 5);
    console.log(topFivePosts)

    table = document.getElementById('topFiveTable')

    topFivePosts.forEach(post => {
        const row = document.createElement('tr');

        const tickerCell = document.createElement('td');
        tickerCell.innerHTML = `<a href='https://finance.yahoo.com/quote/${post.ticker}/'>${post.ticker}</a>`;
        row.appendChild(tickerCell);

        const commentCountCell = document.createElement('td');
        commentCountCell.textContent = post.no_of_comments;
        row.appendChild(commentCountCell);

        const sentimentCell = document.createElement('td');
        if (post.sentiment = 'Bullish') {
            sentimentCell.innerHTML = `<img src='https://static-00.iconduck.com/assets.00/chart-bullish-icon-2048x1844-le9lx19d.png' width=300 height=300>`
        } else if (post.sentiment = 'Bearish') {
            sentimentCell.innerHTML = `<img src='https://static-00.iconduck.com/assets.00/bearish-icon-2048x2017-nw136iz2.png' width=300 height=300>`
        };
        row.appendChild(sentimentCell);

        table.appendChild(row);
    })
}

stocksTable()

function navigateToPage(page) {
    page = page.charAt(0).toUpperCase() + page.slice(1).toLowerCase();
    pageLink = `Assignment2-${page}Page.html`
    console.log(pageLink)
    window.location.href = pageLink
}

function changePageColor(color) {
    document.body.style.backgroundColor = color;
}

async function loadDogBreed(breedInput) {
    breedInput = breedInput.replace(/(^\w|\s\w)(\S*)/g, (_,m1,m2) => m1.toUpperCase()+m2.toLowerCase())
    console.log(breedInput)

    const container = document.getElementById('dogBreedBox')
    const data = await getDogBreeds();
    const breeds = data.data;

    breeds.forEach(breed => {
        if (breed.attributes.name == breedInput) {
            container.innerHTML = `
            <div id='breedInfo'>
                <h1>Name: ${breed.attributes.name}</h1>
                <h3>Description: ${breed.attributes.description}</h3>
                <h3>Min Life: ${breed.attributes.life.min}</h3>
                <h3>Max Life: ${breed.attributes.life.max}</h3>
            </div>
    `;
        }
    })
}

async function stockLookup(ticker) {
    ticker = ticker.toUpperCase();

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);

    const stocksData = await fetch(`https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${formatDate(startDate)}/${formatDate(endDate)}?adjusted=true&sort=asc&limit=120&apiKey=enI0nLsP1upi4vvBFiFGVsKh4GbfcTXK`)
    .then((result) => result.json());

    const dates = []
    const prices = []

    stocksData.results.forEach(({t, c}) => {
        dates.push(new Date(t).toLocaleDateString());
        prices.push(c);
    })
    
    chartContainer = document.getElementById('chartContainer')
    chartContainer.innerHTML = ''

    const chart = document.createElement('canvas');
    chart.setAttribute('id', 'myChart');
    chartContainer.appendChild(chart)

    const ctx = document.getElementById('myChart');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
            label: `${ticker} Stock Price`,
            data: prices,
            borderWidth: 1
            }]
        },
        options: {
            scales: {
            y: {
                beginAtZero: true
            }
            }
        }
    });
}

if (annyang) {

  const commands = {
    'hello': () => { alert('Hello world!'); },
    'navigate to :page': navigateToPage,
    'change the color to :color': changePageColor,
    'load dog breed *breedInput': loadDogBreed,
    'look up :ticker': stockLookup
  };

 
  annyang.addCommands(commands);

  document.getElementById('onButton').addEventListener('click', () => {
    
    annyang.start({ autoRestart: false, continuous: false });
    console.log('Annyang is listening.')
  })
  
  document.getElementById('offButton').addEventListener('click', () => {
    
    annyang.abort();
    console.log('Annyang stopped listening')
  })
  
}
