import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import './ChooseTable.css'; // Assuming you've added CSS styles in this file

function ChooseTable() {
    const [databases, setDatabases] = useState([]);  // List of databases
    const [selectedDatabase, setSelectedDatabase] = useState('');  // Selected database
    const [tables, setTables] = useState([]);  // List of tables
    const [selectedTable, setSelectedTable] = useState('');  // Selected table
    const [tableData, setTableData] = useState([]);  // Data for selected table
    const [loading, setLoading] = useState(false);  // Loading state for API calls
    const [error, setError] = useState('');  // Error state
    const [sqlQuery, setSqlQuery] = useState('');  // User-input SQL query
    const [queryResult, setQueryResult] = useState([]);  // Query result data
    const navigate = useNavigate();  // For navigation if needed

    useEffect(() => {
        const fetchDatabases = async () => {
            setLoading(true);
            setError('');
            try {
                const authHeader = 'Basic ' + btoa('user:password');  // Basic Authentication header
                const response = await fetch('http://localhost:8080/api/databases', {
                    headers: {
                        'Authorization': authHeader,
                    },
                });
                if (!response.ok) throw new Error('Failed to fetch databases');
                const data = await response.json();
                setDatabases(data);
            } catch (error) {
                setError('Error fetching databases: ' + error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDatabases();
    }, []);

    const handleDatabaseChange = async (e) => {
        const db = e.target.value;
        setSelectedDatabase(db);
        setTables([]);
        setSqlQuery('');
        setQueryResult([]);

        if (db) {
            setLoading(true);
            try {
                const authHeader = 'Basic ' + btoa('user:password');
                const response = await fetch(`http://localhost:8080/api/tables?database=${db}`, {
                    headers: {
                        'Authorization': authHeader,
                    },
                });
                if (!response.ok) throw new Error('Failed to fetch tables');
                const data = await response.json();
                setTables(data);
            } catch (error) {
                setError('Error fetching tables: ' + error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleTableSelection = async () => {
        if (selectedTable) {
            setLoading(true);
            setError('');
            try {
                const authHeader = 'Basic ' + btoa('user:password');
                const response = await fetch(`http://localhost:8080/api/table-data?database=${selectedDatabase}&table=${selectedTable}`, {
                    headers: {
                        'Authorization': authHeader,
                    },
                });
                if (!response.ok) throw new Error('Failed to fetch table data');
                const data = await response.json();
                setTableData(data);
            } catch (error) {
                setError('Error fetching table data: ' + error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const executeSqlQuery = async () => {
        if (!sqlQuery.trim()) {
            setError('Veuillez entrer une requête SQL.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const authHeader = 'Basic ' + btoa('user:password');
            const response = await fetch(`http://localhost:8080/api/query?database=${selectedDatabase}`, {
                method: 'POST',
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: sqlQuery }),
            });

            if (!response.ok) throw new Error('Échec de l’exécution de la requête SQL.');
            const data = await response.json();
            setQueryResult(data);
        } catch (error) {
            setError('Erreur lors de l’exécution de la requête SQL: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2>Choisir une base de données et une table</h2>

            {loading && <ClipLoader color="#000000" loading={loading} size={50} />}
            {error && <div className="error">{error}</div>}

            <div>
                <label htmlFor="database">Base de données:</label>
                <select id="database" onChange={handleDatabaseChange} value={selectedDatabase}>
                    <option value="">Sélectionner une base de données</option>
                    {databases.length === 0 ? (
                        <option value="">Aucune base de données disponible</option>
                    ) : (
                        databases.map((db, index) => (
                            <option key={index} value={db}>{db}</option>
                        ))
                    )}
                </select>
            </div>

            {selectedDatabase && (
                <>
                    <div>
                        <label htmlFor="sqlQuery">Entrer votre requête SQL:</label>
                        <textarea
                            id="sqlQuery"
                            rows="4"
                            value={sqlQuery}
                            onChange={(e) => setSqlQuery(e.target.value)}
                        />
                        <button onClick={executeSqlQuery}>Exécuter</button>
                    </div>

                    {queryResult.length > 0 && (
                        <div>
                            <h3>Résultat de la requête</h3>
                            <table>
                                <thead>
                                <tr>
                                    {Object.keys(queryResult[0]).map((col) => (
                                        <th key={col}>{col}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {queryResult.map((row, idx) => (
                                    <tr key={idx}>
                                        {Object.values(row).map((value, index) => (
                                            <td key={index}>{value}</td>
                                        ))}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {selectedDatabase && (
                <div>
                    <label htmlFor="table">Table:</label>
                    <select id="table" onChange={(e) => setSelectedTable(e.target.value)} value={selectedTable}>
                        <option value="">Sélectionner une table</option>
                        {tables.length === 0 ? (
                            <option value="">Aucune table disponible</option>
                        ) : (
                            tables.map((table, index) => (
                                <option key={index} value={table}>{table}</option>
                            ))
                        )}
                    </select>
                </div>
            )}

            <button onClick={handleTableSelection}>Afficher les données</button>

            {tableData.length > 0 && (
                <div>
                    <h3>Données de la table {selectedTable}</h3>
                    <table>
                        <thead>
                        <tr>
                            {Object.keys(tableData[0]).map((col) => (
                                <th key={col}>{col}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {tableData.map((row, idx) => (
                            <tr key={idx}>
                                {Object.values(row).map((value, index) => (
                                    <td key={index}>{value}</td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ChooseTable;
