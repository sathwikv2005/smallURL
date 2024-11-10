module.exports = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Link Expired</title>
    <!-- Importing Sour Gummy Font from Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Sour+Gummy&display=swap" rel="stylesheet">
    <style>
        body {
            background-color: black;
            color: white;
            font-family: 'Sour Gummy', sans-serif;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 60vh;
            margin: 0;
        }
        .message {
            text-align: center;
            font-size: 2em;
            color: red;
            margin-bottom: 20px; /* Space between message and button */
        }
        .btn {
    background-color: red;
    font-family: 'Sour Gummy', sans-serif;
    color: black;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    font-size: 20px;
    border-radius: 5px;
    font-weight: 800;
}
        .btn:hover {
            transform: scale(1.1);
            box-shadow: 5px 5px 0px rgba(255, 0, 0, 0.3);
        }
    </style>
</head>
<body>
    <div class="message">
        Link Not Found or Expired
    </div>
    <button class="btn" onclick="window.location.href = '/'">Home</button>
</body>
</html>

  `
