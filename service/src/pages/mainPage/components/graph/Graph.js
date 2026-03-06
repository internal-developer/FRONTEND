import React from 'react';
// chart js
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2'
import './Graph.scss'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

function Graph({ dumpingEvent }) {

    // 지역별 사건 수 집계
    const locationCount = dumpingEvent.reduce((acc, event) => {
        acc[event.cctv.location] = (acc[event.cctv.location] || 0) + 1;
        return acc;
    }, {});

    const locationLabels = Object.keys(locationCount); // CCTV ID
    const locationData = Object.values(locationCount); // 사건 수

    const barOptions = {
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

    const barData = {
        labels: locationLabels,
        datasets: [
            {
                label: "투기 건수",
                data: locationData,
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(120, 97, 252, 0.7)",
            },
        ],
    };

    // 시간대별 사건 수 집계
    const timeCount = dumpingEvent.reduce((acc, event) => {
        const hour = new Date(event.time).getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
    }, {});

    const timeLabels = Object.keys(timeCount).map(hour => `${hour}시`);
    const timeData = Object.values(timeCount);

    const lineOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: false,
                text: '시간별 투기 건수'
            },
        },
    };

    const lineData = {
        labels: timeLabels,
        datasets: [
            {
                label: "투기 건수",
                data: timeData,
                //borderColor: "rgb(255, 99, 132)",
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
                    <Bar options={barOptions} data={barData} />
                </div>
            </div>

            <div className='Gmenu-container'>
                <div className='Gmenu-title'>
                    시간별 투기 건수 현황 그래프
                </div>
                <div className='Gmenu-graph'>
                    <Line options={lineOptions} data={lineData} />
                </div>
            </div>
        </div>
    )
}

export default Graph