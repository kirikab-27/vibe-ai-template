import { useState } from 'react'
import { AIAssistant } from './components/ai/AIAssistant'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1>🚀 VIBE AI Integrated Template</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        AI機能が統合された開発テンプレートです
      </p>
      
      <div style={{ marginBottom: '2rem' }}>
        <button 
          onClick={() => setCount((count) => count + 1)}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            backgroundColor: '#007acc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          count is {count}
        </button>
      </div>

      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '1rem', 
        borderRadius: '8px',
        marginTop: '2rem'
      }}>
        <h3>✨ AI機能の使い方</h3>
        <ol style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
          <li>右下のAIアシスタントボタンをクリック</li>
          <li>チャットでコード生成や質問ができます</li>
          <li>分析タブでコードの品質チェックが可能</li>
          <li>設定タブでAIの動作をカスタマイズ</li>
        </ol>
      </div>

      <div style={{ 
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#e8f4fd',
        borderRadius: '8px'
      }}>
        <p><strong>🤖 AI機能:</strong></p>
        <ul style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
          <li>コード分析と品質チェック</li>
          <li>インタラクティブなチャット</li>
          <li>オフライン対応</li>
          <li>知識ベース連携</li>
        </ul>
      </div>

      <div style={{ 
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#f0f9ff',
        borderRadius: '8px',
        border: '1px solid #0ea5e9'
      }}>
        <p><strong>🎯 試してみてください:</strong></p>
        <p>右下のAIボタンをクリックして、「React コンポーネントを作成して」と入力してみてください！</p>
      </div>

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  )
}

export default App