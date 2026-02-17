import httpx
from typing import Dict, Any, Optional

PISTON_API_URL = "https://emkc.org/api/v2/piston"

async def execute_code(language: str, code: str) -> Dict[str, Any]:
    """Execute code using Piston API."""
    
    # Map common language names to Piston version/aliases
    lang_map = {
        "javascript": {"language": "javascript", "version": "18.15.0"},
        "typescript": {"language": "typescript", "version": "5.0.3"},
        "python": {"language": "python", "version": "3.10.0"},
        "java": {"language": "java", "version": "15.0.2"},
        "csharp": {"language": "csharp", "version": "6.12.0"},
        "cpp": {"language": "cpp", "version": "10.2.0"},
        "go": {"language": "go", "version": "1.16.2"},
        "php": {"language": "php", "version": "8.2.3"},
        "ruby": {"language": "ruby", "version": "3.0.1"},
        "rust": {"language": "rust", "version": "1.68.2"},
    }
    
    lang_config = lang_map.get(language.lower(), {"language": language, "version": "*"})
    
    payload = {
        "language": lang_config["language"],
        "version": lang_config["version"],
        "files": [
            {
                "content": code
            }
        ]
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(f"{PISTON_API_URL}/execute", json=payload)
            
            if response.status_code != 200:
                return {
                    "success": False,
                    "error": f"Execution failed with status {response.status_code}: {response.text}"
                }
            
            data = response.json()
            run = data.get("run", {})
            
            return {
                "success": True,
                "stdout": run.get("stdout", ""),
                "stderr": run.get("stderr", ""),
                "output": run.get("output", ""),
                "exit_code": run.get("code", 0),
                "signal": run.get("signal", None)
            }
    except Exception as e:
        return {
            "success": False,
            "error": f"Execution error: {str(e)}"
        }
