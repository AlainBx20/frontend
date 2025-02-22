import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import "./local.css"; // Import the external CSS file

function ConnectionManager() {
  const [openDialog, setOpenDialog] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [selectedDatabaseType, setSelectedDatabaseType] = useState("");
  const [authMethod, setAuthMethod] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [excelFile, setExcelFile] = useState(null);
  const [serverName, setServerName] = useState("");
  const [connections, setConnections] = useState([]);
  const [filterServerName, setFilterServerName] = useState("");
  const [filterIdentifier, setFilterIdentifier] = useState("");
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [oracleUsername, setOracleUsername] = useState("");
  const [oraclePassword, setOraclePassword] = useState("");
  const [filterDatabaseType, setFilterDatabaseType] = useState("");

  const [filteredCo, setFilteredConnections] = useState([]);


  const handleOracleUsernameChange = (event) => setOracleUsername(event.target.value);
  const handleOraclePasswordChange = (event) => setOraclePassword(event.target.value);
  const updateFilterServerName = (event) => setFilterServerName(event.target.value);
  const updateFilterIdentifier = (event) => setFilterIdentifier(event.target.value);

  const applyFilters = () => {
    let filteredData = connections;

    // Apply server name filter if provided
    if (filterServerName) {
      filteredData = filteredData.filter((connection) =>
          connection.serverName.toLowerCase().includes(filterServerName.toLowerCase())
      );
    }

    // Apply identifier filter if provided
    if (filterIdentifier) {
      filteredData = filteredData.filter((connection) =>
          connection.identifier.toLowerCase().includes(filterIdentifier.toLowerCase())
      );
    }

    // Update the filtered connections
    setFilteredConnections(filteredData);
    setFilterDialogOpen(false); // Close the filter dialog after applying filters
  };



  // Fetch connections data from API on component mount
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        // Construct the query string based on the filters
        const response = await fetch(`/api/localdb?serverName=${filterServerName}&identifier=${filterIdentifier}`);
        const data = await response.json();
        setConnections(data);
      } catch (error) {
        console.error("Error fetching data from API:", error);
      }
    };

    fetchConnections();
  }, [filterServerName, filterIdentifier]); // Empty dependency array ensures this runs only on mount

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDatabaseType("");
    setAuthMethod("");
    setEmail("");
    setUsername("");
    setPassword("");
    setIdentifier("");
    setExcelFile(null);
    setServerName("");
  };
  const [selectedRow, setSelectedRow] = useState(null);
  const handleFilterDialogOpen = () => setFilterDialogOpen(true);
  const handleSearchDialogOpen = () => setSearchDialogOpen(true);
  const handleFilterDialogClose = () => setFilterDialogOpen(false);
  const handleSearchDialogClose = () => setSearchDialogOpen(false);

  const handleDatabaseTypeChange = (event) => setSelectedDatabaseType(event.target.value);
  const handleAuthMethodChange = (event) => setAuthMethod(event.target.value);
  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);
  const handleIdentifierChange = (event) => setIdentifier(event.target.value);
  const handleFileChange = (event) => setExcelFile(event.target.files[0]);
  const handleServerNameChange = (event) => setServerName(event.target.value);

  const handleSaveConnection = async () => {
    if (!identifier || !selectedDatabaseType) {
      alert("L'identifiant et le fournisseur sont obligatoires!");
      return;
    }

    const formData = new FormData();
    formData.append("identifier", identifier);
    formData.append("databaseType", selectedDatabaseType);

    if (selectedDatabaseType !== "excel") {
      formData.append("serverName", serverName);
    }

    if (selectedDatabaseType === "sqlServer") {
      formData.append("authMethod", authMethod);
      if (authMethod === "sqlAuth") {
        formData.append("username", username);
        formData.append("password", password);
      }
    }

    if (selectedDatabaseType === "excel" && excelFile) {
      formData.append("file", excelFile);
    }

    if (selectedDatabaseType === "oracle") {
      formData.append("oracleService", serverName); // Oracle service name or SID
      formData.append("authMethod", "oracleAuth"); // Oracle always uses oracleAuth

      // For oracleAuth, append Oracle-specific credentials
      formData.append("oracleUsername", oracleUsername);
      formData.append("oraclePassword", oraclePassword);
    }

    try {
      const response = await fetch("/api/localdb/add", {
        method: "POST",
        body: formData, // Send as FormData (not JSON)
      });

      const result = await response.text();
      alert(result);

      if (response.ok) {
        setConnections((prevConnections) => [
          ...prevConnections,
          { identifier, databaseType: selectedDatabaseType, serverName },
        ]);
        handleCloseDialog();
      }
    } catch (error) {
      alert("Erreur lors de l'enregistrement: " + error.message);
    }
  };


  const handleRowClick = (connection) => {
    setSelectedConnection(connection);
    setSelectedRow(connection);
  };

  const handleTestConnection = async () => {
    const connectionData = selectedRow
        ? {
          identifier: selectedRow.identifier,
          databaseType: selectedRow.databaseType,
          serverName: selectedRow.serverName || "",
          authMethod: selectedRow.authMethod || "",
          username: selectedRow.authMethod === "oracleAuth" ? selectedRow.oracleUsername : selectedRow.username || "",
          password: selectedRow.authMethod === "oracleAuth" ? selectedRow.oraclePassword : selectedRow.password || "",
          file: selectedRow.file || null,
        }
        : {
          identifier,
          databaseType: selectedDatabaseType,
          serverName,
          authMethod,
          username,
          oracleUsername,
          oraclePassword,
          password,
          file: excelFile ? excelFile.name : null,
        };

    try {
      const response = await fetch("/api/localdb/testConnection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(connectionData),
      });

      const result = await response.text();
      alert(result);
    } catch (error) {
      alert("Error testing connection: " + error.message);
    }
  };


  const handleFilterServerNameChange = (event) => setFilterServerName(event.target.value);
  const handleFilterIdentifierChange = (event) => setFilterIdentifier(event.target.value);

  const filteredConnections = connections.filter((connection) => {
    return (
        (filterServerName ? connection.serverName.toLowerCase().includes(filterServerName.toLowerCase()) : true) &&
        (filterIdentifier ? connection.identifier.toLowerCase().includes(filterIdentifier.toLowerCase()) : true) &&
        (filterDatabaseType ? connection.databaseType.toLowerCase().includes(filterDatabaseType.toLowerCase()) : true)
    );
  });
  const handleApplyFilter = () => {
    // This function applies the filter and closes the dialog
    setFilterDialogOpen(false);
  };
  return (
      <Box className="app-container">
        <Box className="main-content">
          <Box className="header">
            <Button variant="outlined" onClick={handleFilterDialogOpen}>
              Critères
            </Button>

            <Button variant="contained" color="secondary" onClick={handleTestConnection}>
              Tester Connexion
            </Button>
            <Button variant="contained" color="primary" onClick={handleOpenDialog}>
              Nouveau
            </Button>
          </Box>

          <Box className="table-section">
            <Typography variant="h6">Base de données</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Identifiant</TableCell>
                    <TableCell>Fournisseur</TableCell>
                    <TableCell>Nom du Serveur</TableCell>
                    <TableCell>Type d'Authentification</TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredConnections.map((connection, index) => (
                      <TableRow
                          key={index}
                          onClick={() => handleRowClick(connection)}
                          selected={selectedConnection?.identifier === connection.identifier}
                          style={{ cursor: "pointer" }}
                      >
                        <TableCell>{connection.identifier}</TableCell>
                        <TableCell>{connection.databaseType}</TableCell>
                        <TableCell>{connection.serverName}</TableCell>
                        <TableCell>{connection.authMethod}</TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>

        <Dialog open={filterDialogOpen} onClose={handleFilterDialogClose}>
          <DialogTitle>Filtres de Recherche</DialogTitle>
          <DialogContent>
            <Box mb={2}>
              <Typography variant="subtitle1">Nom du Serveur</Typography>
              <TextField
                  fullWidth
                  label="Filtrer par nom de serveur"
                  variant="outlined"
                  size="small"
                  value={filterServerName}
                  onChange={handleFilterServerNameChange}
              />
            </Box>

            <Box mb={2}>
              <Typography variant="subtitle1">Identifiant</Typography>
              <TextField
                  fullWidth
                  label="Filtrer par base serveur"
                  variant="outlined"
                  size="small"
                  value={filterIdentifier}
                  onChange={handleFilterIdentifierChange}
              />
            </Box>

            <Box mb={2}>
              <Typography variant="subtitle1">Base du Serveur</Typography>
              <TextField
                  fullWidth
                  label="Filtrer par base du serveur"
                  variant="outlined"
                  size="small"
                  value={filterDatabaseType}
                  onChange={(e) => setFilterDatabaseType(e.target.value)}
              />
            </Box>

          </DialogContent>
          <DialogActions>
            <Button onClick={handleFilterDialogClose} color="primary">
              Fermer
            </Button>
            <Button onClick={applyFilters} color="primary">
           Filtrer </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Configurer Nouvelle Connexion</DialogTitle>
          <DialogContent>
            <Box mb={2}>
              <Typography variant="subtitle1">Identifiant</Typography>
              <TextField
                  fullWidth
                  label="Entrez l'identifiant"
                  variant="outlined"
                  size="small"
                  value={identifier}
                  onChange={handleIdentifierChange}
              />
            </Box>

            <Box mb={2}>
              <Typography variant="subtitle1">Fournisseur</Typography>
              <Select
                  fullWidth
                  value={selectedDatabaseType}
                  onChange={handleDatabaseTypeChange}
                  variant="outlined"
                  size="small"
              >
                <MenuItem value="sqlServer">SQL Server</MenuItem>
                <MenuItem value="oracle">Oracle</MenuItem>
                <MenuItem value="excel">Excel</MenuItem>
              </Select>
            </Box>

            {(selectedDatabaseType === "sqlServer" || selectedDatabaseType === "oracle") && (
                <Box mb={2}>
                  <Typography variant="subtitle1">Nom du Serveur</Typography>
                  <TextField
                      fullWidth
                      label="Entrez le nom du serveur"
                      variant="outlined"
                      size="small"
                      value={serverName}
                      onChange={handleServerNameChange}
                  />
                </Box>
            )}

            {selectedDatabaseType === "sqlServer" && (
                <>
                  <Select
                      fullWidth
                      value={authMethod}
                      onChange={handleAuthMethodChange}
                      variant="outlined"
                      size="small"
                  >
                    <MenuItem value="windowsAuth">Authentification Windows</MenuItem>
                    <MenuItem value="sqlAuth">Authentification SQL Server</MenuItem>
                  </Select>

                  {authMethod === "sqlAuth" && (
                      <Box mt={2}>
                        <TextField
                            fullWidth
                            label="Utilisateur"
                            variant="outlined"
                            size="small"
                            value={username}
                            onChange={handleUsernameChange}
                        />
                        <TextField
                            fullWidth
                            label="Mot de passe"
                            variant="outlined"
                            size="small"
                            value={password}
                            onChange={handlePasswordChange}
                            type="password"
                        />
                      </Box>
                  )}
                </>
            )}

            {selectedDatabaseType === "oracle" && (
                <>
                  <Typography variant="subtitle1">Nom d'utilisateur Oracle</Typography>
                  <TextField
                      fullWidth
                      label="Nom d'utilisateur Oracle"
                      variant="outlined"
                      size="small"
                      value={username}
                      onChange={handleUsernameChange}
                  />
                  <Typography variant="subtitle1">Mot de passe Oracle</Typography>
                  <TextField
                      fullWidth
                      label="Mot de passe Oracle"
                      variant="outlined"
                      size="small"
                      value={password}
                      onChange={handlePasswordChange}
                      type="password"
                  />
                  <Box mt={2}>
                    <Typography variant="subtitle1">Service Oracle</Typography>
                    <TextField
                        fullWidth
                        label="Entrez le service Oracle"
                        variant="outlined"
                        size="small"
                        value={serverName}
                        onChange={handleServerNameChange}  // Reusing serverName for service name
                    />
                  </Box>
                </>
            )}

            {selectedDatabaseType === "excel" && (
                <>
                  <Typography variant="subtitle1">Télécharger le fichier Excel</Typography>
                  <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileChange}
                      style={{ display: "block", marginTop: "10px" }}
                  />
                </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Annuler
            </Button>
            <Button onClick={handleSaveConnection} color="primary">
              Enregistrer
            </Button>
            <Button onClick={handleTestConnection} color="primary">
              Tester Connexion
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
  );
}

export default ConnectionManager;
