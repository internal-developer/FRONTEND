import React from 'react'
// chart js
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Bar } from 'react-chartjs-2'
// import regionGraph from '../../../../assets/images/region_graph.png';
// import timeGraph from '../../../../assets/images/time_graph.png';
import './Graph.scss'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

function Graph({dumpingEvent}) {

     // CCTV별 사건 수 집계
     const cctvCount = dumpingEvent.reduce((acc, event) => {
        acc[event.location] = (acc[event.location] || 0) + 1;
        return acc;
    }, {});

    const labels = Object.keys(cctvCount); // CCTV ID
    const charData = Object.values(cctvCount); // 사건 수

    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: false,
            text: '지역별 투기 건수',
            },
        },
    };

      const data = {
        labels,
        datasets: [
            {
                label: "투기 건수",
                data: charData,
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(120, 97, 252, 0.7)",
            },
        ],
    };


    return (
        <div className='Gmenu'>
            <div className='Gmenu-container'>
                <div className='Gmenu-title'>
                    지역별 투기 건수 현황 그래프
                </div>
                <div className='Gmenu-graph'>
                    <Bar options={options} data={data} />
                </div>
            </div>

            <div className='Gmenu-container'>
                <div className='Gmenu-title'>
                    시간별 투기 건수 현황 그래프
                </div>
                <div className='Gmenu-graph'>
                    <Bar options={options} data={data} />
                </div>
            </div>
        </div>
    )
}

export default Graph