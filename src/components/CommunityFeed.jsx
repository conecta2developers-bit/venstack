import React, { useState } from 'react';
import { MessageSquare, Heart, Plus, Send } from 'lucide-react';
import { COMMUNITY_TOPICS } from '../data/mockData';

export const CommunityFeed = () => {
  const [posts, setPosts] = useState(COMMUNITY_TOPICS);
  const [likedPosts, setLikedPosts] = useState({});
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  const toggleLike = (postId) => {
    setLikedPosts((prev) => {
      const isLiked = !prev[postId];
      const newLiked = { ...prev, [postId]: isLiked };

      setPosts((current) =>
        current.map((p) => {
          if (p.id === postId) {
            return { ...p, likes: isLiked ? p.likes + 1 : p.likes - 1 };
          }
          return p;
        })
      );

      return newLiked;
    });
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost = {
      id: `post-${Date.now()}`,
      author: 'Tú (Desarrollador)',
      role: 'Full Stack Dev',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      timeAgo: 'Justo ahora',
      category: 'Discusión General',
      title: newTitle,
      content: newContent,
      likes: 1,
      comments: 0,
      tag: 'Comunidad',
    };

    setPosts([newPost, ...posts]);
    setNewTitle('');
    setNewContent('');
    setShowNewPostForm(false);
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      
      {/* Feed Sub-header */}
      <div style={{
        background: '#ffffff',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        borderRadius: '20px',
        padding: '16px 20px',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1d1d1f', margin: 0 }}>
            Foro & Debates Técnicos
          </h2>
          <p style={{ fontSize: '12px', color: '#86868b', margin: '2px 0 0 0' }}>
            Dudas sobre cobro internacional (USDT/Zinli), setup eléctrico y entrevistas remotas.
          </p>
        </div>

        <button
          onClick={() => setShowNewPostForm(!showNewPostForm)}
          className="apple-btn-primary"
          style={{ fontSize: '12px' }}
        >
          <Plus size={13} strokeWidth={2.5} />
          <span>{showNewPostForm ? 'Cerrar' : 'Crear Post'}</span>
        </button>
      </div>

      {/* New Post Box */}
      {showNewPostForm && (
        <form
          onSubmit={handleCreatePost}
          style={{
            background: '#ffffff',
            border: '1.5px solid #0d9488',
            borderRadius: '20px',
            padding: '18px',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#0f766e' }}>
            Nuevo Debate en la Comunidad
          </span>

          <input
            type="text"
            required
            placeholder="Título del debate (ej. ¿Qué banco internacional es más fácil de asociar con Zinli?)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '12.5px', outline: 'none' }}
          />

          <textarea
            rows="3"
            required
            placeholder="Escribe tu duda, experiencia o recomendación..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '12.5px', outline: 'none', resize: 'none' }}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setShowNewPostForm(false)}
              className="apple-btn-secondary"
              style={{ fontSize: '12px', padding: '5px 12px' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="apple-btn-primary"
              style={{ fontSize: '12px', padding: '5px 14px' }}
            >
              <Send size={12} />
              <span>Publicar</span>
            </button>
          </div>
        </form>
      )}

      {/* Feed Posts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {posts.map((post) => {
          const isLiked = !!likedPosts[post.id];
          return (
            <div
              key={post.id}
              style={{
                background: '#ffffff',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                borderRadius: '20px',
                padding: '18px',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              {/* Author Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={post.avatar}
                    alt={post.author}
                    style={{ width: '36px', height: '36px', borderRadius: '12px', objectFit: 'cover' }}
                  />
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#1d1d1f', display: 'block' }}>
                      {post.author}
                    </span>
                    <span style={{ fontSize: '11px', color: '#86868b' }}>
                      {post.role} • {post.timeAgo}
                    </span>
                  </div>
                </div>

                <span style={{
                  fontSize: '10.5px',
                  fontWeight: 700,
                  color: '#0f766e',
                  background: '#f0fdfa',
                  border: '1px solid #ccfbf1',
                  borderRadius: '999px',
                  padding: '2px 8px'
                }}>
                  {post.tag}
                </span>
              </div>

              {/* Title & Body */}
              <div>
                <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#1d1d1f', margin: '0 0 4px 0' }}>
                  {post.title}
                </h3>
                <p style={{ fontSize: '12.5px', color: '#424245', lineHeight: 1.55, margin: 0 }}>
                  {post.content}
                </p>
              </div>

              {/* Action Bar */}
              <div style={{
                marginTop: '4px',
                paddingTop: '10px',
                borderTop: '1px solid rgba(0, 0, 0, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '11.5px',
                color: '#86868b'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <button
                    onClick={() => toggleLike(post.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: isLiked ? '#fff1f2' : 'transparent',
                      color: isLiked ? '#e11d48' : '#86868b',
                      padding: '4px 8px',
                      borderRadius: '999px',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: isLiked ? 700 : 500,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Heart size={13} color={isLiked ? '#e11d48' : '#86868b'} fill={isLiked ? '#e11d48' : 'none'} />
                    <span>{post.likes}</span>
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <MessageSquare size={13} color="#86868b" />
                    <span>{post.comments} respuestas</span>
                  </div>
                </div>

                <span style={{ fontSize: '11px', color: '#0f766e', background: '#f0fdfa', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
                  {post.category}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
