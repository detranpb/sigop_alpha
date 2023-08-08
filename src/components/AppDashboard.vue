<template>
    <main>
    <div class="dashboard">
      <div class="chart-container">
        <canvas ref="chartCanvas"> </canvas>
      </div>
    </div>
    </main>
  </template>
  
  <script>
  import Chart from 'chart.js';
  
  export default {
    mounted() {
      this.createChart();
    },
    methods: {
      createChart() {
        const ctx = this.$refs.chartCanvas.getContext('2d');
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5'],
            datasets: [
              {
                label: 'Dataset 1',
                data: [10, 20, 30, 40, 50],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
              {
                label: 'Dataset 2',
                data: [20, 30, 40, 50, 60],
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      },
    },
  };
  </script>
  
  <style>
  .dashboard {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  .chart-container {
    width: 600px;
    height: 400px;
  }
  </style>
  