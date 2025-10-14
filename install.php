<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$targetFile = __DIR__ . '/backend/ConnectOnceToMyDB.php';
$tempFile   = $targetFile . '.tmp';

if (!file_exists($targetFile)) die("Fichier introuvable");

$config = file_get_contents($targetFile);
if ($config === false) die("Impossible de lire le fichier");

$password = $_POST['password'] ?? null;

if (!$password) {
    preg_match("/private\s+\$servername\s*=\s*'([^']+)'/", $config, $matchServer);
    preg_match("/private\s+\$username\s*=\s*'([^']+)'/", $config, $matchUser);
    $servername = $matchServer[1] ?? 'localhost';
    $username   = $matchUser[1] ?? 'root';
    echo "<h2>Config MySQL</h2>
          <p>Serveur: $servername</p>
          <p>Utilisateur: $username</p>
          <form method='post'>
            <input type='password' name='password' required>
            <button type='submit'>Enregistrer</button>
          </form>";
    exit;
}

$pattern = '/^\s*(?:private|protected|public)?\s*\$password\s*=\s*(["\'])(.*?)\1\s*(?:;|;.*$)/xm';

$newConfig = preg_replace_callback(
    $pattern,
    function($matches) use ($password) {
        return str_replace($matches[2], addslashes($password), $matches[0]);
    },
    $config,
    1,
    $count
);

if ($count === 0) {
    if (preg_match('/class\s+[A-Za-z0-9_]+\s*{/', $config, $cm, PREG_OFFSET_CAPTURE)) {
        $classPos = $cm[0][1];
        $bracePos = strpos($config, '{', $classPos);
        if ($bracePos !== false) {
            $insertPos = $bracePos + 1;
            $insertStr = "\n    private \$password = '" . addslashes($password) . "';\n";
            $newConfig = substr($config, 0, $insertPos) . $insertStr . substr($config, $insertPos);
        }
    }
}

// Mise à jour $this->password
$patternThis = '/^\s*\$this->password\s*=\s*(["\'])(.*?)\1\s*;/m';
$newConfig = preg_replace_callback(
    $patternThis,
    function($matches) use ($password) {
        return str_replace($matches[2], addslashes($password), $matches[0]);
    },
    $newConfig,
    1,
    $countThis
);

// Sauvegarde fichier
if (file_put_contents($tempFile, $newConfig) === false) die("Impossible d’écrire le fichier temporaire");
if (!rename($tempFile, $targetFile)) die("Impossible de remplacer le fichier original");

// Connexion MySQL
preg_match("/private\s+\$servername\s*=\s*'([^']+)'/", $newConfig, $matchServer);
preg_match("/private\s+\$username\s*=\s*'([^']+)'/", $newConfig, $matchUser);
$servername = $matchServer[1] ?? 'localhost';
$username   = $matchUser[1] ?? 'root';

$conn = @new mysqli($servername, $username, $password);
if ($conn->connect_error) die("<div style='color:red;font-weight:bold;'>❌ Connexion MySQL échouée : " . $conn->connect_error . "</div>");

echo "<div style='color:green;font-weight:bold;'>✅ Connexion MySQL réussie</div>";
if ($countThis > 0) {
    echo "<div style='color:green;'>🔑 password remplacé avec succès</div>";
} else {
    echo "<div style='color:orange;'>⚠️ password non trouvée</div>";
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ----------------- Bouton et import SQL -----------------
echo '<br><hr><form method="post">
        <input type="hidden" name="password" value="'.htmlspecialchars($password).'">
        <input type="hidden" name="import_sql" value="1">
        <button type="submit">📂 Installer les fichiers SQL du répertoire DB</button>
      </form>';


// Bloc import et création APE_user
if (isset($_POST['import_sql']) && $password) {
    $rootPass= $password;

    // si import demandé mais pas de root_pass, afficher formulaire root
    if (!$rootPass) {
        echo '<form method="post">
                <input type="hidden" name="password" value="'.htmlspecialchars($password).'">
                <input type="hidden" name="import_sql" value="1">
                <label>Mot de passe MySQL root :</label><br>
                <input type="password" name="root_pass" required>
                <button type="submit">Créer APE_user & importer SQL</button>
              </form>';
        exit;
    }

    // Connexion root MySQL avec le mot de passe fourni
    $rootConn = @new mysqli('localhost', 'root', $rootPass);
    if ($rootConn->connect_error) {
        echo "<div style='color:red;'>❌ Impossible de se connecter en root : ".htmlspecialchars($rootConn->connect_error)."</div>";
        exit;
    }

    // Création / confirmation APE_user
    $escapedPwd = $rootConn->real_escape_string($password);
    $sqlCreate = "CREATE USER IF NOT EXISTS 'APE_user'@'localhost' IDENTIFIED BY '{$escapedPwd}';
                  GRANT ALL PRIVILEGES ON *.* TO 'APE_user'@'localhost' WITH GRANT OPTION;
                  FLUSH PRIVILEGES;";
    if (!$rootConn->multi_query($sqlCreate)) {
        echo "<div style='color:red;'>❌ Erreur lors de la création de l'utilisateur : ".htmlspecialchars($rootConn->error)."</div>";
        $rootConn->close();
        exit;
    } else {
        do { if ($res = $rootConn->store_result()) $res->free(); } while ($rootConn->more_results() && $rootConn->next_result());
        echo "<div style='color:green;'>✅ Utilisateur APE_user créé/confirmé via root</div>";
    }
    $rootConn->close();

    // Connexion avec APE_user pour importer SQL
    $conn = @new mysqli('localhost', 'APE_user', $password);
    if ($conn->connect_error) {
        echo "<div style='color:red;'>❌ Connexion avec APE_user impossible : ".htmlspecialchars($conn->connect_error)."</div>";
        exit;
    }

    $sqlDir = __DIR__ . '/DB';
    $sqlFiles = glob($sqlDir . '/*.sql');
    if (!$sqlFiles) {
        echo "<div>Aucun fichier .sql trouvé dans DB/</div>";
        $conn->close();
        exit;
    }

    echo "<div style='font-family:monospace'>";
    foreach ($sqlFiles as $file) {
        $sql = file_get_contents($file);
        if ($sql === false) { echo "Impossible de lire " . htmlspecialchars(basename($file)) . "<br>"; continue; }

        if (!$conn->multi_query($sql)) {
            echo "<span style='color:red'>❌ Erreur dans " . htmlspecialchars(basename($file)) . " : " . htmlspecialchars($conn->error) . "</span><br>";
            while ($conn->more_results() && $conn->next_result()) { if ($r = $conn->store_result()) $r->free(); }
        } else {
            do { if ($r = $conn->store_result()) $r->free(); } while ($conn->more_results() && $conn->next_result());
            echo "<span style='color:green'>✅ " . htmlspecialchars(basename($file)) . " exécuté avec succès</span><br>";
        }
    }
    echo "</div>";
    $conn->close();
    exit;
}
// ---------------------------------------------------------



?>
