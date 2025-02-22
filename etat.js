import React, { useState } from "react";
import "./etat.css"; // Import the CSS file

const CreationEtat = () => {
    const [rows, setRows] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newIdentifiant, setNewIdentifiant] = useState(""); // Updated for identifiant
    const [newEtat, setNewEtat] = useState("");
    const [newDescriptif, setNewDescriptif] = useState("");
    const [sourceData, setSourceData] = useState(""); // Store source data
    const [nbreParametres, setNbreParametres] = useState(""); // Number of parameters
    const [requete, setRequete] = useState(""); // SQL query
    const [xsdFile, setXsdFile] = useState(null); // XSD file
    const [isDataPopupOpen, setIsDataPopupOpen] = useState(false); // Control visibility of data selection popup
    const [fetchedData, setFetchedData] = useState([
        // Example data
        { id: 1, name: "Data 1" },
        { id: 2, name: "Data 2" },
        { id: 3, name: "Data 3" },
    ]);
    const [validationMessage, setValidationMessage] = useState(""); // State for validation message

    // Handle adding new row
    const addNewRow = () => {
        if (
            newIdentifiant.trim() === "" ||
            newEtat.trim() === "" ||
            newDescriptif.trim() === ""
        ) {
            setValidationMessage("Tous les champs doivent être remplis.");
            return; // Ensure no empty values are added
        }

        const newRow = {
            identifiant: newIdentifiant,
            etat: newEtat,
            descriptif: newDescriptif,
            sourceData,
            nbreParametres,
            requete,
            xsdFile,
        };
        setRows([...rows, newRow]); // Add new row to table
        setIsModalOpen(false); // Close modal
        resetForm(); // Reset form fields
        setValidationMessage(""); // Clear validation message
    };

    // Handle XSD file change
    const handleXsdFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.name.endsWith(".xsd")) {
            setXsdFile(file);
        } else {
            alert("Only .xsd files are allowed.");
        }
    };

    // Reset form after adding new row
    const resetForm = () => {
        setNewIdentifiant("");
        setNewEtat("");
        setNewDescriptif("");
        setSourceData("");
        setNbreParametres("");
        setRequete("");
        setXsdFile(null);
    };

    // Handle opening the data selection popup
    const openDataPopup = () => {
        setIsDataPopupOpen(true);
    };

    // Handle selecting data from the fetched data
    const selectData = (data) => {
        setSourceData(data.name); // Use the name of the selected data
        setIsDataPopupOpen(false); // Close the popup
    };

    return (
        <div className="table-container">
            <h1 className="title">Créer État</h1>

            {/* Nouveau Button */}
            <button className="nouveau-button" onClick={() => setIsModalOpen(true)}>
                Nouveau
            </button>

            {/* Validation message */}
            {validationMessage && (
                <span className="validation-message">{validationMessage}</span>
            )}

            {/* Modal Popup */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Ajouter un Nouvel État</h2>
                        {/* Identifiant Input */}
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Entrez l'identifiant"
                            value={newIdentifiant}
                            onChange={(e) => setNewIdentifiant(e.target.value)} // Updated to set identifiant
                        />
                        {/* Descriptif Input */}
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Entrez le descriptif"
                            value={newDescriptif}
                            onChange={(e) => setNewDescriptif(e.target.value)}
                        />
                        {/* Source de données Input */}
                        <div className="source-container">
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Entrez la source de données"
                                value={sourceData}
                                onChange={(e) => setSourceData(e.target.value)}
                            />
                            <button className="search-icon" onClick={openDataPopup}>
                                🔍
                            </button>
                        </div>
                        {/* Number of parameters Input */}
                        <input
                            type="number"
                            className="input-field"
                            placeholder="Nombre de paramètres"
                            value={nbreParametres}
                            onChange={(e) => setNbreParametres(e.target.value)}
                        />
                        {/* Requête (SQL) Input */}
                        <textarea
                            className="input-field"
                            placeholder="Entrez la requête SQL"
                            value={requete}
                            onChange={(e) => setRequete(e.target.value)}
                        />
                        {/* XSD File Upload */}
                        <label>📁Fichier XSD</label>
                        <input
                            type="file"
                            className="input-field"
                            accept=".xsd"
                            onChange={handleXsdFileChange}
                        />
                        <div className="modal-actions">
                            <button className="save-button" onClick={addNewRow}>
                                Ajouter
                            </button>
                            <button
                                className="close-button"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Data Selection Popup */}
            {isDataPopupOpen && (
                <div className="modal-overlay">
                    <div className="modal data-popup">
                        <h2>Choisir une Source de Données</h2>
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Actes</th> {/* No hidden class here */}
                                <th>
                                    <label className="label-field">Identifiants</label>
                                </th>
                                <th>
                                    <label className="label-field">État</label>
                                </th>
                                <th>
                                    <label className="label-field">Descriptif</label>
                                </th>
                                <th className="hidden-column">
                                    <label className="label-field">Source de Données</label>
                                </th>
                                <th className="hidden-column">
                                    <label className="label-field">Nombre de Paramètres</label>
                                </th>
                                <th className="hidden-column">
                                    <label className="label-field">Requête</label>
                                </th>
                                <th className="hidden-column">
                                    <label className="label-field">XSD File</label>
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {rows.map((row) => (
                                <tr key={row.identifiant}>
                                    <td>{row.identifiant}</td>
                                    <td>{row.etat}</td>
                                    <td>{row.descriptif}</td>
                                    <td className="hidden-column">{row.sourceData}</td>
                                    <td className="hidden-column">{row.nbreParametres}</td>
                                    <td className="hidden-column">{row.requete}</td>
                                    <td className="hidden-column">
                                        {row.xsdFile ? row.xsdFile.name : "No file"}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <button
                            className="close-button"
                            onClick={() => setIsDataPopupOpen(false)}
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            )}

            {/* Table */}
            <table className="table">
                <thead>
                <tr>
                    <th>Actes</th>
                    <th>
                        <label className="label-field">Identifiants</label>
                    </th>
                    <th>
                        <label className="label-field">État</label>
                    </th>
                    <th>
                        <label className="label-field">Descriptif</label>
                    </th>
                    <th className="hidden-column">
                        <label className="label-field">Source de Données</label>
                    </th>
                    <th className="hidden-column">
                        <label className="label-field">Nombre de Paramètres</label>
                    </th>
                    <th className="hidden-column">
                        <label className="label-field">Requête</label>
                    </th>
                    <th className="hidden-column">
                        <label className="label-field">XSD File</label>
                    </th>
                </tr>
                </thead>
                <tbody>
                {rows.map((row) => (
                    <tr key={row.identifiant}>
                        <td>{row.identifiant}</td>
                        <td>{row.etat}</td>
                        <td>{row.descriptif}</td>
                        <td className="hidden-column">{row.sourceData}</td>
                        <td className="hidden-column">{row.nbreParametres}</td>
                        <td className="hidden-column">{row.requete}</td>
                        <td className="hidden-column">
                            {row.xsdFile ? row.xsdFile.name : "No file"}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default CreationEtat;


