
// let months =[];

let profitChart=null;

const fetchProfitData = async () => {
  try {
    const currentYear = document.getElementById('currentYear').value;
      const response = await fetch('/admin/profitData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentYear: currentYear }), 
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json(); // Parse JSON response
      // console.log("Profit Data:", data);
      return data 
  } catch (error) {
      console.error("Error fetching profit data:", error);
  }
};
let months = []; // Declare a variable in a higher scope

const getMonths = async () => {
    try {
        const profitData = await fetchProfitData(); // Fetch data
        if (profitData) {
            // Extract months and store in the higher scope variable
            months = profitData.map(item => new Date(item.month).toLocaleString('default', { month: 'long' }));
        }
    } catch (error) {
        console.error("Error getting months:", error);
    }
};
let Revenue =[];
const getRevenue= async () => {
  try {
      const profitData = await fetchProfitData(); // Fetch data
      if (profitData) {
          // Extract months and store in the higher scope variable
          Revenue = profitData.map(item => item.revenue);
      }
  } catch (error) {
      console.error("Error getting months:", error);
  }
};
let Profit =[];
const getProfit= async () => {
  try {
      const profitData = await fetchProfitData(); // Fetch data
      if (profitData) {
         
          Profit = profitData.map(item => item.profit);
      }
  } catch (error) {
      console.error("Error getting months:", error);
  }
};
let Expenses = [];
const getExpenses= async () => {
  try {
      const profitData = await fetchProfitData(); // Fetch data
      if (profitData) {
         
        Expenses = profitData.map(item => item.expenses);
      }
  } catch (error) {
      console.error("Error getting months:", error);
  }
};
// Call the function and ensure it's awaited
(async () => {
  await getMonths(); // Wait for the months to be populated
    await getRevenue(); // Wait for the Revenue to be populated
    await getProfit();
    await getExpenses();
    // console.log("Months Outside Function:", months);
    updateChart(months, Revenue, Expenses, Profit);
    updateProfitsTable(months, Revenue, Expenses, Profit);
})();


const updateChart = (months, Revenue, Expenses, Profit) => {
  const ctx = document.getElementById('profitChart').getContext('2d');
  // const ctx1 = document.getElementById('profitChartBranch').getContext('2d');
 
  if (profitChart) {
    profitChart.destroy();
    profitChart = null;
  }

  
  profitChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Revenue',
          data: Revenue,
          backgroundColor: '#d63384',
        },
        {
          label: 'Expenses',
          data: Expenses,
          backgroundColor: '#ffc107',
        },
        {
          label: 'Profit',
          data: Profit,
          backgroundColor: '#6610f2',
        },
      ],
    },
  });
};
function updateProfitsTable(months, revenues, expenses, profits) {
  // Get the tbody of the profitsTable
  const tbody = document.getElementById('profitsTable').querySelector('tbody');

  // Clear existing rows in tbody
  tbody.innerHTML = '';

  // Ensure all arrays are of the same length
  if (
    months.length !== revenues.length ||
    revenues.length !== expenses.length ||
    expenses.length !== profits.length
  ) {
    console.error('All input arrays must have the same length');
    return;
  }

  // Iterate over the data and populate the table
  months.forEach((month, index) => {
    // Create a new row
    const row = document.createElement('tr');

    // Add month cell
    const monthCell = document.createElement('td');
    monthCell.textContent = month;
    row.appendChild(monthCell);

    // Add revenue cell
    const revenueCell = document.createElement('td');
    revenueCell.textContent = revenues[index];
    row.appendChild(revenueCell);

    // Add expenses cell
    const expensesCell = document.createElement('td');
    expensesCell.textContent = expenses[index];
    row.appendChild(expensesCell);

    // Add profit cell
    const profitCell = document.createElement('td');
    profitCell.textContent = profits[index];
    row.appendChild(profitCell);

    // Append the row to the tbody
    tbody.appendChild(row);
  });
}

document.getElementById('currentYear').addEventListener('change', async (event) => { 
  const currentYear = event.target.value;
  await fetchProfitData();
  await getMonths(); 
    await getRevenue(); 
    await getProfit();
    await getExpenses();
    updateChart(months, Revenue, Expenses, Profit);
    updateProfitsTable(months, Revenue, Expenses, Profit);
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