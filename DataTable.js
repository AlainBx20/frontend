import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import "./styles.css";

const DataTable = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [data] = useState([
        { code: "TR-DON", description: "Don des dons..." },
        { code: "002", description: "Élément 2" }, // Fixed encoding
    ]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [isOkClicked, setIsOkClicked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSearchPopup, setShowSearchPopup] = useState(false);
    const [showSearchInput, setShowSearchInput] = useState(false); // Track search input visibility
    const [showDatePicker, setShowDatePicker] = useState(true); // Date picker is always visible

    const filteredData = data.filter(
        (item) =>
            item.code.includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRowClick = (code) => {
        setSelectedItem(code);
        if (code === "TR-DON") {
            // Only show date picker if TR-DON is selected
            setSelectedDate(null);
        }
    };

    const handleOk = () => {
        if (!selectedItem || !selectedDate || !selectedFile) {
            setErrorMessage(
                "Veuillez sélectionner un élément, une date et un fichier XSD valides"
            );
            setIsOkClicked(false);
            return;
        }

        if (selectedItem === data[0].code) {
            const lastDayOfMonth = new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth() + 1,
                0
            );
            if (selectedDate.getDate() !== lastDayOfMonth.getDate()) {
                setErrorMessage("Veuillez sélectionner le dernier jour du mois");
                setIsOkClicked(false);
                return;
            }
        }

        setErrorMessage("");
        setIsOkClicked(true);
        console.log("OK cliqué pour l'élément:", selectedItem);
        console.log("Date sélectionnée:", selectedDate);
    };

    const handleAnnuler = () => {
        setSelectedItem(null);
        setSelectedDate(null);
        setSelectedFile(null);
        setErrorMessage("");
        setIsOkClicked(false);
    };

    const handleGenerateXML = async () => {
        if (!isOkClicked) {
            alert(
                "Veuillez cliquer sur OK pour valider la sélection avant de générer le XML"
            );
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("item", selectedItem);
        formData.append("date", selectedDate.toISOString());

        try {
            const response = await fetch("http://localhost:8080/api/upload-xsd", {
                method: "POST",
                headers: {
                    Authorization: "Basic " + btoa("user:password"),
                },
                body: formData,
            });

            const message = await response.text();
            alert(message);
        } catch (error) {
            console.error("Erreur lors de la génération du XML:", error);
            alert("Une erreur est survenue lors de la génération du XML.");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateExcel = async () => {
        if (!isOkClicked) {
            alert(
                "Veuillez cliquer sur OK pour valider la sélection avant de générer l'Excel"
            );
            return;
        }

        const requestData = {
            item: selectedItem,
            date: selectedDate.toISOString(),
        };

        try {
            const response = await axios.post(
                "http://localhost:8080/generateb",
                requestData
            );
            console.log("Excel généré:", response.data);
            alert("Le fichier Excel a été généré avec succès !");
        } catch (error) {
            console.error("Erreur lors de la génération de l'Excel:", error);
            alert("Échec de la génération de l'Excel");
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        console.log("Fichier sélectionné: ", file);
    };

    const toggleSearchPopup = () => {
        setShowSearchPopup((prevState) => !prevState);
        setShowSearchInput((prevState) => !prevState); // Toggle search input visibility
    };

    const handleSearchInputChange = (e) => {
        setSearchTerm(e.target.value);
        if (!e.target.value) {
            setShowSearchPopup(false); // Close the suggestions when input is empty
        } else {
            setShowSearchPopup(true); // Show suggestions when there's text
        }
    };

    const handleSuggestionClick = (code) => {
        setSearchTerm(code);
        setShowSearchPopup(false); // Close the suggestions after selecting one
    };

    // Toggle the date picker visibility on icon click
    const toggleDatePicker = () => {
        setShowDatePicker((prevState) => !prevState);
    };

    return (
        <div className="main-container">
            <h1>Tableau de données</h1>

            <div className="container">
                {/* Search Input with Button */}
                <div className="search-container">
                    <button onClick={toggleSearchPopup} className="search-btn">
                        &#x2026;
                    </button>
                    {/* Search Input */}
                    {showSearchInput && (
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={handleSearchInputChange}
                            className="search-input"
                        />
                    )}
                </div>

                {/* Search Popup */}
                {showSearchPopup && (
                    <div className="search-popup">
                        {filteredData.length > 0 && (
                            <ul className="suggestions-list">
                                {filteredData.map((item) => (
                                    <li
                                        key={item.code}
                                        onClick={() => handleSuggestionClick(item.code)}
                                    >
                                        {item.code} - {item.description}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {/* Table */}
                {(searchTerm || selectedItem) && (
                    <>
                        <table>
                            <thead>
                            <tr>
                                <th>Code</th>
                                <th>Description</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((item) => (
                                    <tr
                                        key={item.code}
                                        onClick={() => handleRowClick(item.code)}
                                        className={selectedItem === item.code ? "selected" : ""}
                                    >
                                        <td>{item.code}</td>
                                        <td>{item.description}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="no-items">
                                        Aucun élément trouvé
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>

                        {/* Date Picker (always visible) */}
                        {selectedItem === "TR-DON" && (
                            <div className="date-picker-container">
                <span className="date-icon" onClick={toggleDatePicker}>
                  📅
                </span>
                                {showDatePicker && (
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={(date) => setSelectedDate(date)}
                                        placeholderText="Sélectionnez une date"
                                    />
                                )}
                            </div>
                        )}

                        {errorMessage && <p className="error">{errorMessage}</p>}

                        <div className="button-group">
                            <button onClick={handleOk}>OK</button>
                            <button className="annuler" onClick={handleAnnuler}>
                                Annuler
                            </button>
                        </div>

                        <div className="bottom-buttons">
                            <button onClick={handleGenerateXML}>
                                {loading ? <div className="spinner"></div> : "Générer XML"}
                            </button>
                            <button onClick={handleGenerateExcel}>Générer Excel</button>
                        </div>
                    </>
                )}

                {/* File Upload */}
                <div className="file-upload">
                    <label htmlFor="xsdFile" className="custom-file-label">
                        📂
                    </label>
                    <input
                        type="file"
                        id="xsdFile"
                        accept=".xsd"
                        onChange={handleFileChange}
                        className="file-input"
                    />
                </div>
            </div>
        </div>
    );
};

export default DataTable;
