import logo from './logo.svg';
import './App.css';
import {BillData, TAGS, generateRandomBill} from "./Data";
import React, {useState, useEffect, useMemo} from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import FilterSidebarContainer from "./components/filter_sidebar/filterSidebarContainer";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const MainAppContainer = () => {
    return (
        <Router>
            <Container>
                <Row>
                    <Col sm={3}>
                        <FilterSidebarContainer/>
                        {/*Home*/}
                        {/*<Link to="/">Home</Link>*/}
                    </Col>
                    <Col>
                        <SimpleBillTable/>
                        {/*<Link to="/results">Results</Link>*/}
                    </Col>
                </Row>
                {/*<Row>*/}
                {/*    <Col>*/}
                {/*        <Routes>*/}
                {/*            /!*<Route path="/" element={<Home />} />*!/*/}
                {/*            /!*<Route path="/results" element={<Results />} />*!/*/}
                {/*        </Routes>*/}
                {/*    </Col>*/}
                {/*</Row>*/}
            </Container>
        </Router>
    );
}

function ContainerFluidExample() {
    return (
        <Container fluid>
            <Row>
                <Col>1 of 1</Col>
            </Row>
        </Container>
    );
}



// An array composed of 5 random bills for testing purposes
const bills = Array.from({length: 5}, () => generateRandomBill());

//A component that takes a filename and an array of data, and creates a table with the data
function Table({filename, data}) {
    const rowStyles = {
        maxHeight: '50px',
        overflowY: 'auto'
    };
    const cellStyles = {
        overflowY: 'auto',
        maxHeight: '50px',
        border: '1px solid black',
        maxWidth: '400px',
        width: '100%',
        // overflow: 'auto',
        // textOverflow: 'ellipsis',
        // whiteSpace: 'nowrap',
    };
    const tableStyle = {
        borderCollapse: 'collapse',
        border: '1px solid black',
        // width: '100%',
        tableLayout: 'fixed',
        // maxHeight: '50px',
        // overflowY: 'auto'
    };
    const scrollableDiv = {
        width: '100%',
        height: '100px',
        overflowY: 'scroll'
    };


    const tbodyStyles = {maxHeight: '50px', overflowY: 'auto'};

    return (
        <div>
            <h1>{filename}</h1>
            <table style={tableStyle}>
                <thead>
                <tr>
                    {Object.keys(data[0]).map(key => (
                        <th key={key}>{key}</th>
                    ))}
                </tr>
                </thead>
                <tbody style={tbodyStyles} >
                {data.map((row, index) => (
                    <tr key={index} style={rowStyles}>
                        {Object.values(row).map((value, index) => (
                            <td key={index} style={cellStyles}>
                                <div style={scrollableDiv}>
                                    {value}
                                </div>
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}



function CsvTable({ filename }) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const csvFile = require(`./assets/csvs/${filename}.csv`);
            const response = await fetch(csvFile);
            const text = await response.text();
            const rows = text.split("\n");
            // Rows and headers are pipe-delimited, per how they are stored in the repo
            const headers = rows[0].split("|");
            const rowsData = rows.slice(1).map((row) => row.split("|"));
            const newData = rowsData.map((row) =>
                headers.reduce((obj, key, index) => {
                    obj[key] = row[index];
                    return obj;
                }, {})
            );
            setData(newData);
            setLoading(false);
        };

        fetchData();
    }, [filename]);

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <Table filename={filename} data={data} />
            )}
        </div>
    );
}

function Page({ name }) {
    return (
        <div>
            <h1>{name}</h1>
            <p>This is the {name} page.</p>
        </div>
    );
}

const pages = ['Home', 'About', 'Contact'];
const rssFiles = [
    "HouseBillsAndResolutions",
    "HouseCommitteeAssignments",
    "HouseCommitteeMeetingSchedule",
    "HouseCoSponsorshipMemoranda",
    "HouseDailySessionReports",
    "HouseLegislativeJournals",
    "HouseMembers",
    "HouseRollCallVotes",
    "HouseVotedAmendments",
    "SenateBillsAndResolutions",
    "SenateCommitteeAssignments",
    "SenateCommitteeMeetingSchedule",
    "SenateCoSponsorshipMemoranda",
    "SenateExecutiveNominationsCalendar",
    "SenateFloorAmendments",
    "SenateLegislativeJournals",
    "SenateMembers",
    "SenateRollCallVotes",
    "SenateSessionCalendar",
    "SenateSessionNotes",
]

const SimpleBillTable = () => {
    return (
        // <Router>
        <>
            <ul>
                {rssFiles.map(name => (
                    <li key={name}>
                        <Link to={`/${name}`}>{name}</Link>
                    </li>
                ))}
            </ul>
            <Routes>
                {rssFiles.map(name => (
                    <Route key={name} path={`/${name}`} element={<CsvTable filename={name} />} />
                ))}
            </Routes>
        </>
    );
}


function App() {
  return (
      <MainAppContainer/>
      // <Router>
      //     <div className="App">
      //         <ContainerFluidExample/>
      //
      //         <ul>
      //             {rssFiles.map(name => (
      //                 <li key={name}>
      //                     <Link to={`/${name}`}>{name}</Link>
      //                 </li>
      //             ))}
      //         </ul>
      //         <Routes>
      //             {rssFiles.map(name => (
      //                 <Route key={name} path={`/${name}`} element={<CsvTable filename={name} />} />
      //             ))}
      //         </Routes>
      //
      //         {/*<CsvTable/>*/}
      //     </div>
      // </Router>

  );
}

export default App;
