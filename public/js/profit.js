


const ctx = document.getElementById('profitChart').getContext('2d');
const profitChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['January', 'February'],
    datasets: [
      {
        label: 'Revenue',
        data: [30000, 28000],
        backgroundColor: '#d63384',
      },
      {
        label: 'Expenses',
        data: [18000, 16500],
        backgroundColor: '#ffc107',
      },
      {
        label: 'Profit',
        data: [12000, 11500],
        backgroundColor: '#6610f2',
      },
    ],
  },
});


fetch('/transactions')
  .then((response) => response.json())
  .then((data) => {
    const transactionTable = document.getElementById('transactionTable');
    data.forEach((transaction) => {
      const row = `
        <tr>
          <td>${transaction.date}</td>
          <td>${transaction.id}</td>
          <td>${transaction.type}</td>
          <td>$${transaction.amount}</td>
          <td>${transaction.method}</td>
          <td>${transaction.status}</td>
        </tr>
      `;
      transactionTable.innerHTML += row;
    });
  });