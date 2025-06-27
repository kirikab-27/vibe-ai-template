import express from 'express';
import cors from 'cors';
import { claude } from '@instantlyeasy/claude-code-sdk-ts';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Claude Code SDK Server is running' });
});

// AI Chat endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, model = 'sonnet' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await claude()
      .withModel(model)
      .skipPermissions()
      .query(message)
      .asText();

    res.json({ 
      response,
      model,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Chat error:', error);
    
    if (error.message?.includes('claude') && error.message?.includes('not found')) {
      res.status(503).json({ 
        error: 'Claude CLI not found. Please install: npm install -g @anthropic-ai/claude-code',
        setup_required: true
      });
    } else if (error.message?.includes('authentication') || error.message?.includes('login')) {
      res.status(401).json({ 
        error: 'Authentication required. Please run: claude login',
        auth_required: true
      });
    } else {
      res.status(500).json({ 
        error: 'Internal server error',
        details: error.message
      });
    }
  }
});

// AI File operations
app.post('/api/ai/file-operation', async (req, res) => {
  try {
    const { operation, filePath, content } = req.body;

    let query = '';
    let tools = [];

    switch (operation) {
      case 'read':
        query = `Read the file: ${filePath}`;
        tools = ['Read'];
        break;
      case 'write':
        query = `Create or update the file ${filePath} with the following content:\n${content}`;
        tools = ['Write'];
        break;
      case 'analyze':
        query = `Analyze the file: ${filePath} and provide insights`;
        tools = ['Read', 'Grep'];
        break;
      default:
        return res.status(400).json({ error: 'Invalid operation' });
    }

    const result = await claude()
      .allowTools(...tools)
      .skipPermissions()
      .query(query)
      .asResult();

    res.json({ 
      result,
      operation,
      filePath,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('File operation error:', error);
    res.status(500).json({ 
      error: 'File operation failed',
      details: error.message
    });
  }
});

// AI Code analysis
app.post('/api/ai/analyze-project', async (req, res) => {
  try {
    const { query: userQuery, directory = process.cwd() } = req.body;

    const analysis = await claude()
      .allowTools('Read', 'Grep', 'Glob', 'Find')
      .inDirectory(directory)
      .skipPermissions()
      .query(userQuery || 'Analyze this project structure and provide insights')
      .asToolExecutions();

    res.json({ 
      analysis,
      directory,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Project analysis error:', error);
    res.status(500).json({ 
      error: 'Project analysis failed',
      details: error.message
    });
  }
});

// AI Code generation
app.post('/api/ai/generate-code', async (req, res) => {
  try {
    const { prompt, fileType = 'tsx', style = 'modern' } = req.body;

    const codeQuery = `Generate ${fileType} code for: ${prompt}. 
    Use ${style} style and best practices. 
    Include proper TypeScript types and error handling.`;

    const code = await claude()
      .withModel('sonnet')
      .query(codeQuery)
      .asText();

    res.json({ 
      code,
      fileType,
      style,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Code generation error:', error);
    res.status(500).json({ 
      error: 'Code generation failed',
      details: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Claude Code SDK Server running on http://localhost:${PORT}`);
  console.log(`📋 API endpoints:`);
  console.log(`   GET  /api/health`);
  console.log(`   POST /api/ai/chat`);
  console.log(`   POST /api/ai/file-operation`);
  console.log(`   POST /api/ai/analyze-project`);
  console.log(`   POST /api/ai/generate-code`);
  console.log(`\n🔧 Make sure you have Claude CLI installed and authenticated:`);
  console.log(`   npm install -g @anthropic-ai/claude-code`);
  console.log(`   claude login`);
});

export default app; 