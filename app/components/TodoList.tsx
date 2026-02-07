"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit3, CheckCircle2, Circle, Save, X, ClipboardCheck } from "lucide-react";

type Todo = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
};

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await fetch("/api/todos");
    const data = await res.json();
    setTodos(data);
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });
    setTitle("");
    setDescription("");
    setLoading(false);
    fetchTodos();
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });
    fetchTodos();
  };

  const deleteTodo = async (id: string) => {
    if (!confirm("Bu görevi silmek istediğine emin misin?")) return;
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    fetchTodos();
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDesc(todo.description || "");
  };

  const saveEdit = async () => {
    if (!editingId) return;
    await fetch(`/api/todos/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, description: editDesc }),
    });
    setEditingId(null);
    fetchTodos();
  };

  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #EFF6FF 0%, #ECFEFF 50%, #F0FDFA 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {/* ANA KART */}
      <div style={{
        width: '100%',
        maxWidth: '700px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '32px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(219, 234, 254, 0.5)',
        padding: '48px',
        border: '1px solid rgba(219, 234, 254, 0.8)'
      }}>
        
        {/* BAŞLIK */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '72px',
            height: '72px',
            background: 'linear-gradient(135deg, #60A5FA 0%, #22D3EE 100%)',
            borderRadius: '20px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            boxShadow: '0 10px 25px -5px rgba(96, 165, 250, 0.4)'
          }}>
            <ClipboardCheck size={36} color="white" strokeWidth={2.5} />
          </div>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            color: '#1F2937',
            marginBottom: '8px',
            letterSpacing: '-0.5px'
          }}>
            Yapılacaklar
          </h1>
          <p style={{ fontSize: '15px', color: '#6B7280', fontWeight: '500' }}>
            {todos.length > 0
              ? `${todos.length} görevden ${completedCount} tanesi tamamlandı ✨`
              : "Henüz görev eklemedin"}
          </p>
        </div>

        {/* EKLEME FORMU */}
        <form onSubmit={addTodo} style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Yeni görev ekle..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                flex: '1',
                minWidth: '200px',
                backgroundColor: 'rgba(239, 246, 255, 0.6)',
                border: '2px solid #DBEAFE',
                borderRadius: '14px',
                padding: '16px 20px',
                fontSize: '16px',
                color: '#1F2937',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#60A5FA';
                e.target.style.backgroundColor = '#FFFFFF';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#DBEAFE';
                e.target.style.backgroundColor = 'rgba(239, 246, 255, 0.6)';
              }}
            />
            <button
              type="submit"
              disabled={loading || !title.trim()}
              style={{
                padding: '16px 32px',
                background: loading || !title.trim() 
                  ? '#9CA3AF' 
                  : 'linear-gradient(135deg, #3B82F6 0%, #22D3EE 100%)',
                color: 'white',
                fontWeight: '600',
                fontSize: '15px',
                borderRadius: '14px',
                border: 'none',
                cursor: loading || !title.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: loading || !title.trim() ? 'none' : '0 10px 20px -5px rgba(59, 130, 246, 0.4)',
                transition: 'all 0.2s',
                opacity: loading || !title.trim() ? 0.5 : 1
              }}
            >
              <Plus size={20} />
              {loading ? "Ekleniyor..." : "Ekle"}
            </button>
          </div>
        </form>

        {/* LİSTE */}
        <div style={{
          maxHeight: '500px',
          overflowY: 'auto',
          paddingRight: '8px'
        }}>
          {todos.length === 0 ? (
            <div style={{
              padding: '80px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#EFF6FF',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <ClipboardCheck size={40} color="#BFDBFE" />
              </div>
              <p style={{ color: '#9CA3AF', fontWeight: '500', marginBottom: '4px' }}>
                Liste henüz boş
              </p>
              <p style={{ color: '#9CA3AF', fontSize: '14px' }}>
                İlk görevini ekleyerek başla! 🚀
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className="todo-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '18px',
                    backgroundColor: todo.completed ? 'rgba(249, 250, 251, 0.5)' : 'rgba(239, 246, 255, 0.4)',
                    border: todo.completed ? '2px solid #E5E7EB' : '2px solid #DBEAFE',
                    borderRadius: '14px',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                >
                  {/* CHECKBOX */}
                  <button
                    onClick={() => toggleTodo(todo.id, todo.completed)}
                    style={{
                      flexShrink: 0,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: todo.completed ? '#22C55E' : '#D1D5DB',
                      transition: 'all 0.2s',
                      padding: 0
                    }}
                  >
                    {todo.completed ? (
                      <CheckCircle2 size={28} strokeWidth={2.5} />
                    ) : (
                      <Circle size={28} strokeWidth={2.5} />
                    )}
                  </button>

                  {/* İÇERİK */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {editingId === todo.id ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          autoFocus
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          style={{
                            flex: 1,
                            backgroundColor: '#FFFFFF',
                            border: '2px solid #60A5FA',
                            borderRadius: '10px',
                            padding: '10px 14px',
                            fontSize: '16px',
                            color: '#1F2937',
                            outline: 'none'
                          }}
                        />
                        <button
                          onClick={saveEdit}
                          style={{
                            padding: '10px',
                            background: 'none',
                            border: 'none',
                            color: '#16A34A',
                            cursor: 'pointer',
                            borderRadius: '10px',
                            transition: 'background 0.2s'
                          }}
                        >
                          <Save size={20} />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          style={{
                            padding: '10px',
                            background: 'none',
                            border: 'none',
                            color: '#6B7280',
                            cursor: 'pointer',
                            borderRadius: '10px',
                            transition: 'background 0.2s'
                          }}
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ) : (
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: todo.completed ? '#9CA3AF' : '#1F2937',
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        margin: 0,
                        transition: 'all 0.2s'
                      }}>
                        {todo.title}
                      </h3>
                    )}
                  </div>

                  {/* BUTONLAR */}
                  {editingId !== todo.id && (
                    <div className="action-buttons" style={{
                      display: 'flex',
                      gap: '4px',
                      opacity: 0,
                      transition: 'opacity 0.2s'
                    }}>
                      <button
                        onClick={() => startEdit(todo)}
                        style={{
                          padding: '10px',
                          background: 'none',
                          border: 'none',
                          color: '#9CA3AF',
                          cursor: 'pointer',
                          borderRadius: '10px',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#3B82F6';
                          e.currentTarget.style.backgroundColor = '#EFF6FF';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#9CA3AF';
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        style={{
                          padding: '10px',
                          background: 'none',
                          border: 'none',
                          color: '#9CA3AF',
                          cursor: 'pointer',
                          borderRadius: '10px',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#EF4444';
                          e.currentTarget.style.backgroundColor = '#FEF2F2';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#9CA3AF';
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        {todos.length > 0 && (
          <div style={{
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid #E5E7EB'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '14px',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{
                  padding: '6px 14px',
                  backgroundColor: '#FED7AA',
                  color: '#C2410C',
                  borderRadius: '20px',
                  fontWeight: '600'
                }}>
                  {todos.length - completedCount} Bekliyor
                </span>
                <span style={{
                  padding: '6px 14px',
                  backgroundColor: '#BBF7D0',
                  color: '#15803D',
                  borderRadius: '20px',
                  fontWeight: '600'
                }}>
                  {completedCount} Tamamlandı
                </span>
              </div>
              <span style={{ color: '#9CA3AF', fontSize: '13px' }}>
                Toplam: {todos.length}
              </span>
            </div>
          </div>
        )}
      </div>

<style jsx>{`
  .todo-item:hover .action-buttons {
    opacity: 1 !important;
  }
  .todo-item:hover {
    box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.1);
  }
`}</style>
    </div>
  );
}
