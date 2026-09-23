<?php

// Set the timezone (optional, defaults to server configuration)
date_default_timezone_set('UTC');

// Generate the timestamp string
$timestamp = date('Y-m-d H:i:s');
$commitMessage = "timestamp-" . $timestamp;

// Array of Git commands to execute
$commands = [
    'git add .',
    'git commit -m ' . escapeshellarg($commitMessage),
    'git push'
];

// Execute each command and output results
foreach ($commands as $command) {
    echo "Running: {$command}\n";

    $output = [];
    $returnCode = 0;

    // Execute command and capture output and return status
    exec($command . ' 2>&1', $output, $returnCode);

    // Display output
    echo implode("\n", $output) . "\n\n";

    // Stop execution if a command fails
    if ($returnCode !== 0) {
        echo "Error: Command failed with exit code {$returnCode}. Aborting.\n";
        exit(1);
    }
}

echo "Git auto-commit and push completed successfully.\n";