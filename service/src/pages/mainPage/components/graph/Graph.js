import React from 'react'
import regionGraph from '../../../../assets/images/region_graph.png';
import timeGraph from '../../../../assets/images/time_graph.png';
import './Graph.scss'

function Graph() {
    return (
        <div className='Gmenu'>
            <div className='Gmenu-container'>
                <div className='Gmenu-title'>
                    지역별 투기 건수 현황 그래프
                </div>
                <div className='Gmenu-graph'>
                    <img src={regionGraph} />
                </div>
            </div>

            <div className='Gmenu-container'>
                <div className='Gmenu-title'>
                    시간별 투기 건수 현황 그래프
                </div>
                <div className='Gmenu-graph'>
                    <img src={timeGraph} />
                </div>
            </div>
        </div>
    )
}

export default Graph