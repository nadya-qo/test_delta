let chart
let metricsData = []

fetch('data.json')
   .then(res => res.json())
   .then(data => {
      metricsData = data
      renderTable(data)
      drawChart(data[0])
   })

function formatNumber(num) {
   return num.toLocaleString('ru-RU')
}

// процент вчера относительно сегодня
function calculatePercent(current, yesterday) {
   if (current === 0) return 0
   return ((current - yesterday) / yesterday * 100).toFixed(0)
}

function renderTable(data) {
   const topBody = document.querySelector("#topRows")
   const bottomBody = document.querySelector("#bottomRows")

   topBody.innerHTML = ""
   bottomBody.innerHTML = ""

   data.forEach((metric, index) => {
      const percentYesterday = calculatePercent(metric.current, metric.yesterday)
      const tr = document.createElement("tr")

      if (index === 0) {
         tr.classList.add("active")
      }

      const tdName = `<td>${metric.name}</td>`

      // текущий день без процентов
      const tdCurrent = `<td>${formatNumber(metric.current)}</td>`

      // вчера
      let yesterdayClass = ""
      let percentHTML = ""

      if (percentYesterday > 0) {
         yesterdayClass = "regress"
      }

      if (percentYesterday < 0) {
         yesterdayClass = "progress"
      }

      if (percentYesterday !== 0) {
         percentHTML = `<span class="percent">${percentYesterday}%</span>`
      }

      const tdYesterday = `
         <td class="${yesterdayClass}">
            ${formatNumber(metric.yesterday)} ${percentHTML}
         </td>
      `

      // этот день недели- просто число
      const tdWeek = `<td>${formatNumber(metric.week)}</td>`

      tr.innerHTML = tdName + tdCurrent + tdYesterday + tdWeek
      tr.addEventListener("click", () => {

         document
            .querySelectorAll("#metricsTable tr")
            .forEach(r => r.classList.remove("active"))
         tr.classList.add("active")

         drawChart(metric)
      })

      if (index < 1) {
         topBody.appendChild(tr)
      } else {
         bottomBody.appendChild(tr)
      }
   })

}

function drawChart(metric) {

   const ctx = document.getElementById("chart")

   if (chart) {
      chart.destroy()
   }

   chart = new Chart(ctx, {
      type: "line",
      data: {
         labels: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
         datasets: [{
            data: metric.history,
            borderColor: "#2a9d8f",
            fill: false,
            tension: 0
         }]
      },

      options: {
         responsive: true,
         plugins: {
            legend: {
               display: false
            }
         },
         scales: {
            x: {
               border: {
                  width: 2,
                  color: "#000"
               },
               grid: {
                  display:false
               }
            },
            y: {
               beginAtZero: true,
               border: {
                  width: 2,
                  color: "#000"
               },
               grid: {
                  display:false
               }
            }
         }
      }
   })
}