import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Box, 
  Button, 
  Paper, 
  Typography, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  PlayArrow, 
  Refresh, 
  CloudQueue, 
  CloudDone,
  Fullscreen,
  FullscreenExit
} from '@mui/icons-material';
import axios from 'axios';

interface CodePlaygroundProps {
  sessionId: number;
  role: 'mentor' | 'mentee';
  userId: number;
  initialCode?: string;
  initialLanguage?: string;
  onCodeChange?: (code: string) => void;
  syncEnabled?: boolean;
}

const CodePlayground: React.FC<CodePlaygroundProps> = ({ 
  sessionId, 
  role, 
  userId,
  initialCode = '', 
  initialLanguage = 'javascript',
  syncEnabled = true
}) => {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState(initialLanguage);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSynced, setIsSynced] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const socketRef = useRef<WebSocket | null>(null);
  const editorRef = useRef<any>(null);

  // WebSocket Setup
  useEffect(() => {
    if (!syncEnabled) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host === 'localhost:4173' ? 'localhost:8000' : window.location.host;
    const wsUrl = `${protocol}//${host}/api/v1/collaboration/${sessionId}/ws?token=${token}`;

    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'init') {
        if (message.data.code) setCode(message.data.code);
        if (message.data.language) setLanguage(message.data.language);
      } else if (message.type === 'code_update') {
        if (message.data.user_id !== userId) {
          setCode(message.data.code);
          setIsSynced(true);
        }
      } else if (message.type === 'language_update') {
        setLanguage(message.data.language);
      }
    };

    socket.onopen = () => setIsSynced(true);
    socket.onclose = () => setIsSynced(false);

    return () => {
      socket.close();
    };
  }, [sessionId, userId, syncEnabled]);

  const handleEditorChange = (value: string | undefined) => {
    if (value === undefined) return;
    setCode(value);
    
    if (syncEnabled && socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'code_update',
        data: { code: value }
      }));
    }
  };

  const handleLanguageChange = (event: any) => {
    const newLang = event.target.value;
    setLanguage(newLang);
    
    if (syncEnabled && socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'language_update',
        data: { language: newLang }
      }));
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    try {
      const response = await axios.post('/api/v1/mentorship/execute', {
        code,
        language
      });
      setOutput(response.data.output || response.data.error || 'No output');
    } catch (error) {
      setOutput('Error executing code: ' + (error as any).message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: isFullscreen ? '100vh' : '600px',
        position: isFullscreen ? 'fixed' : 'relative',
        top: isFullscreen ? 0 : 'auto',
        left: isFullscreen ? 0 : 'auto',
        right: isFullscreen ? 0 : 'auto',
        bottom: isFullscreen ? 0 : 'auto',
        zIndex: isFullscreen ? 9999 : 1,
        overflow: 'hidden',
        borderRadius: isFullscreen ? 0 : 2
      }}
    >
      {/* Toolbar */}
      <Box sx={{ p: 1, backgroundColor: '#1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #333' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={language}
              onChange={handleLanguageChange}
              sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444' } }}
            >
              <MenuItem value="javascript">JavaScript</MenuItem>
              <MenuItem value="typescript">TypeScript</MenuItem>
              <MenuItem value="python">Python</MenuItem>
              <MenuItem value="java">Java</MenuItem>
              <MenuItem value="cpp">C++</MenuItem>
              <MenuItem value="rust">Rust</MenuItem>
            </Select>
          </FormControl>
          
          <Button 
            variant="contained" 
            color="success" 
            startIcon={isRunning ? <CircularProgress size={20} color="inherit" /> : <PlayArrow />}
            onClick={runCode}
            disabled={isRunning}
          >
            Run
          </Button>

          <Tooltip title={isSynced ? "Synced" : "Disconnected"}>
            <IconButton size="small">
              {isSynced ? <CloudDone color="success" /> : <CloudQueue color="error" />}
            </IconButton>
          </Tooltip>
        </Box>

        <Box>
          <IconButton onClick={() => setIsFullscreen(!isFullscreen)} sx={{ color: 'white' }}>
            {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
          </IconButton>
        </Box>
      </Box>

      {/* Editor & Output Container */}
      <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
        <Box sx={{ flexGrow: 1, height: '100%' }}>
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={handleEditorChange}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              automaticLayout: true,
              readOnly: false // Could be conditional based on role/turn
            }}
            onMount={(editor) => { editorRef.current = editor; }}
          />
        </Box>

        <Box 
          sx={{ 
            width: isFullscreen ? '30%' : '250px', 
            backgroundColor: '#000', 
            color: '#0f0', 
            p: 1, 
            overflowY: 'auto',
            fontFamily: 'monospace',
            fontSize: '12px',
            borderLeft: '1px solid #333'
          }}
        >
          <Typography variant="caption" sx={{ color: '#aaa', display: 'block', mb: 1, borderBottom: '1px solid #222' }}>
            OUTPUT
          </Typography>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{output}</pre>
        </Box>
      </Box>
    </Paper>
  );
};

export default CodePlayground;
