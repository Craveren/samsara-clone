@echo off
cd mcp-servers
for %%p in (3008 3009 3010 3011 3012 3013) do (
  cd %%p
  npm init -y >nul 2>&1
  npm i express >nul 2>&1
  (
    echo const express = require^('express'^);
    echo const app = express^(^);
    echo app.use^(express.json^(^)^);
    echo app.get^('/health', ^(req,res^) =^> res.json^{status: 'MCP %%p LIVE'}^^);
    echo app.post^('/generate', ^(req,res^) =^> res.json^{success: true, data: 'Mock %%p response'}^^);
    echo app.listen^(%%p, ^(^) =^> console.log^('MCP %%p: http://localhost:%%p'^)^);
  ) > server.js
  start cmd /k "node server.js"
  cd ..
)
echo 🚀 6 MCPs LIVE: ports 3008-3013!
pause

