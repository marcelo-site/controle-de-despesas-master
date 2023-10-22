const transactionUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay= document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')
const inputTransactionType = document.querySelectorAll('.type input')
const labelTransactionType =document.querySelectorAll('.type label')
// console.log(labelTransactionType)
// labelTransactionType[1].classList.add('active')

inputTransactionType.forEach((el, i) => {
    el.addEventListener('change', () => {
        console.log(labelTransactionType)
        labelTransactionType.forEach(label => label.classList.remove('active'))
        if(el.checked) labelTransactionType[i].classList.add('active')
    })
})

inputTransactionAmount.addEventListener('input', function () {
    this.value = this.value
        .replace(/[^0-9.|,|-]/g, '')
        .replace(/(\*?)\*/g, '$1');
})

const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'))
let transactions = localStorage
.getItem('transactions') !== null ? localStorageTransactions : []

const addTransactionsDOM = transaction => {
    const operator = transaction.amount < 0 ? '-':'+'
    const cssClass = transaction.amount < 0 ? 'minus':'plus'
    const amountWithOperator = Math.abs(transaction.amount)
    const li = document.createElement('li')
    li.classList.add(cssClass)
    li.innerHTML = `${transaction.name} <span>${operator} ${amountWithOperator
        .toLocaleString('pt-br', {
            style: 'currency',
            currency: 'BRL'
        })}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>`
    transactionUl.append(li)
}
const removeTransaction = ID => {
    transactions = transactions
    .filter(transaction => transaction.id != ID)
    updateLocalStorage()
    init()
}

const updateBalanceValues = () =>{
    const transactionAmounts = transactions
        .map(transaction => transaction.amount)
    const total = transactionAmounts
        .reduce((accumulator, transaction) => accumulator + transaction, 0)
        .toFixed(2)
    const income = transactionAmounts
        .filter(value => value > 0)
        .reduce((accumulator, transaction)=> accumulator + transaction, 0)
        .toFixed(2)
    const expense = Math.abs(
        transactionAmounts
        .filter(value => value < 0)
        .reduce((accumulator, value)=> {
           return accumulator + value
        }, 0)
        .toFixed(2)
    ) 
    // const 
    balanceDisplay.textContent = parseFloat(total).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL' })
    incomeDisplay.textContent = parseFloat(income).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL' })
    expenseDisplay.textContent = parseFloat(expense).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL' })
}

const init = () => {
    transactionUl.innerHTML = ''
    transactions.forEach(addTransactionsDOM)
    updateBalanceValues()
}
init()
const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}
const generateID= () => Math.round(Math.random() * 1000)

form.addEventListener('submit', e => {
    e.preventDefault()
    
    const transactionName = inputTransactionName.value.trim()
    const transactionAmount = inputTransactionAmount.value.trim().replace(',','.')
    if(inputTransactionName === '' || inputTransactionAmount === '') {
        alert('Dados insuficientes')
        return
    }
    const type = e.target.type.value
   
    const transaction = { 
        id: generateID(),
         name: transactionName, 
        amount: type === 'receita' ? Number(transactionAmount) : Number(-transactionAmount)
    }
    transactions.push(transaction)
    init()
    updateLocalStorage()

    inputTransactionName.value = ''
    inputTransactionAmount.value= ''
})