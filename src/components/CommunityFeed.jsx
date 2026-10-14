import React, { useState, useMemo } from 'react';
import { 
  MessageSquare, Heart, Plus, Send, Trash2, Search, X, 
  Sparkles, Code2, Palette, Brain, Shield, DollarSign, Zap
} from 'lucide-react';
import { getSafeAvatarUrl } from '../utils/avatar';

const CATEGORIES = [
  { id: 'all', label: 'Todos los Temas', icon: Sparkles, color: '#0d9488' },
  { id: 'Software & Código', label: '💻 Software', icon: Code2, color: '#0284c7' },
  { id: 'Diseño & Producto', label: '🎨 UI/UX', icon: Palette, color: '#d97706' },
  { id: 'Inteligencia Artificial', label: '🤖 IA & Modelos', icon: Brain, color: '#7c3aed' },
  { id: 'Ciberseguridad', label: '🛡️ Seguridad', icon: Shield, color: '#e11d48' },
  { id: 'Pagos & Finanzas', label: '💵 USDT, Zinli & Remoto', icon: DollarSign, color: '#059669' },
  { id: 'Setup & Electricidad', label: '⚡ Setup, Luz & Fibra', icon: Zap, color: '#f59e0b' },
];

export const CommunityFeed = ({
  currentUser = null,
  userProfile = null,
  companyProfile = null,
  isCompanyUser = false,
  onOpenAuth = () => {},
  posts = [],
  onSavePost = () => {},
  onToggleLike = () => {},
  onAddComment = () => {},
  onDeletePost = () => {},
  onDeleteComment = () => {}
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [submittingComment, setSubmittingComment] = useState({});

  // New post form state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Software & Código');
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);

  // User identifier for likes
  const currentUserId = currentUser?.uid || currentUser?.email || (currentUser ? 'logged-user' : null);

  // Helper for current user's display identity
  const currentAuthorName = currentUser?.name || userProfile?.name || companyProfile?.name || 'Miembro de la Comunidad';
  const currentAuthorRole = isCompanyUser 
    ? (companyProfile?.name ? `Empresa • ${companyProfile.name}` : 'Empresa / Reclutador')
    : (userProfile?.role || 'Desarrollador / Profesional Tech');
  const currentAuthorAvatar = getSafeAvatarUrl(
    currentUser?.avatar || userProfile?.avatar || companyProfile?.avatar, 
    currentAuthorName
  );

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory = selectedCategory === 'all' || 
        post.category?.toLowerCase() === selectedCategory.toLowerCase() ||
        post.tag?.toLowerCase() === selectedCategory.toLowerCase();

      const term = searchTerm.toLowerCase().trim();
      const matchesSearch = !term || 
        post.title?.toLowerCase().includes(term) ||
        post.content?.toLowerCase().includes(term) ||
        post.author?.toLowerCase().includes(term) ||
        post.category?.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchTerm]);

  // Handle post creation
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    if (!newTitle.trim() || !newContent.trim()) return;

    setIsSubmittingPost(true);
    try {
      const postTag = newCategory.includes('Software') ? 'Software'
        : newCategory.includes('UI/UX') || newCategory.includes('Diseño') ? 'UI/UX'
        : newCategory.includes('Artificial') || newCategory.includes('IA') ? 'IA'
        : newCategory.includes('Seguridad') ? 'Ciberseguridad'
        : newCategory.includes('Pagos') ? 'Finanzas'
        : 'Comunidad';

      const newPost = {
        id: `post-${Date.now()}`,
        author: currentAuthorName,
        role: currentAuthorRole,
        avatar: currentAuthorAvatar,
        userId: currentUserId,
        timeAgo: 'Justo ahora',
        createdAt: Date.now(),
        category: newCategory,
        tag: postTag,
        title: newTitle.trim(),
        content: newContent.trim(),
        likes: 1,
        likedBy: [currentUserId],
        comments: []
      };

      await onSavePost(newPost);
      setNewTitle('');
      setNewContent('');
      setShowNewPostForm(false);
    } catch (err) {
      console.error('Error al crear post:', err);
    } finally {
      setIsSubmittingPost(false);
    }
  };

  // Toggle comments expand/collapse
  const toggleComments = (postId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Handle submitting a comment
  const handleCommentSubmit = async (postId, e) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    const text = (commentInputs[postId] || '').trim();
    if (!text) return;

    setSubmittingComment((prev) => ({ ...prev, [postId]: true }));
    try {
      await onAddComment(postId, text);
      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
      // Ensure comments section stays open
      setExpandedComments((prev) => ({ ...prev, [postId]: true }));
    } catch (err) {
      console.error('Error al agregar comentario:', err);
    } finally {
      setSubmittingComment((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const handleLikeClick = (postId) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    onToggleLike(postId);
  };

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      
      {/* Feed Sub-header Card */}
      <div style={{
        background: '#ffffff',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        borderRadius: '24px',
        padding: '22px 24px',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        <div style={{ maxWidth: '540px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#0d9488' }}>
              Comunidad & Debates Tech
            </span>
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1d1d1f', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
            Foro Comunitario Venstack
          </h2>
          <p style={{ fontSize: '12.5px', color: '#6e6e73', margin: 0, lineHeight: 1.5 }}>
            Comparte aprendizajes de proyectos, pide opiniones sobre cobros remotos (USDT/Zinli), setup de respaldo eléctrico o recomendaciones de código.
          </p>
        </div>

        <button
          onClick={() => {
            if (!currentUser) {
              onOpenAuth();
            } else {
              setShowNewPostForm(!showNewPostForm);
            }
          }}
          className="apple-btn-primary"
          style={{ 
            fontSize: '12.5px', 
            padding: '8px 16px', 
            borderRadius: '999px',
            whiteSpace: 'nowrap'
          }}
        >
          {showNewPostForm ? (
            <>
              <X size={14} />
              <span>Cerrar Formulario</span>
            </>
          ) : (
            <>
              <Plus size={14} strokeWidth={2.5} />
              <span>Crear Debate</span>
            </>
          )}
        </button>
      </div>

      {/* New Post Form Drawer */}
      {showNewPostForm && (
        <form
          onSubmit={handleCreatePost}
          style={{
            background: '#ffffff',
            border: '1.5px solid #0d9488',
            borderRadius: '24px',
            padding: '22px',
            boxShadow: '0 8px 30px rgba(13, 148, 136, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            animation: 'slideDown 0.25s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src={currentAuthorAvatar}
                alt={currentAuthorName}
                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #0d9488' }}
              />
              <div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#1d1d1f', display: 'block' }}>
                  {currentAuthorName}
                </span>
                <span style={{ fontSize: '11px', color: '#86868b' }}>
                  {currentAuthorRole}
                </span>
              </div>
            </div>

            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#0d9488' }}>
              Nuevo Debate
            </span>
          </div>

          {/* Category Selector Chips */}
          <div>
            <label style={{ fontSize: '11.5px', fontWeight: 600, color: '#1d1d1f', display: 'block', marginBottom: '6px' }}>
              Categoría del debate:
            </label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setNewCategory(cat.id)}
                  style={{
                    fontSize: '11.5px',
                    padding: '5px 10px',
                    borderRadius: '8px',
                    border: newCategory === cat.id ? `1.5px solid ${cat.color}` : '1px solid rgba(0,0,0,0.08)',
                    background: newCategory === cat.id ? `${cat.color}15` : '#f5f5f7',
                    color: newCategory === cat.id ? cat.color : '#424245',
                    fontWeight: newCategory === cat.id ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '11.5px', fontWeight: 600, color: '#1d1d1f', display: 'block', marginBottom: '6px' }}>
              Título del debate:
            </label>
            <input
              type="text"
              required
              placeholder="Ej. ¿Qué banco o billetera es más conveniente para recibir pagos de Deel en Venezuela?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.12)',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11.5px', fontWeight: 600, color: '#1d1d1f', display: 'block', marginBottom: '6px' }}>
              Detalles o pregunta para la comunidad:
            </label>
            <textarea
              rows="4"
              required
              placeholder="Describe tu caso, comparte capturas conceptuales o código para que la comunidad pueda aportar recomendaciones de valor..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.12)',
                fontSize: '13px',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box',
                lineHeight: 1.55
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '4px' }}>
            <button
              type="button"
              onClick={() => setShowNewPostForm(false)}
              className="apple-btn-secondary"
              style={{ fontSize: '12px', padding: '6px 14px' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmittingPost}
              className="apple-btn-primary"
              style={{ fontSize: '12px', padding: '6px 18px', opacity: isSubmittingPost ? 0.7 : 1 }}
            >
              <Send size={13} />
              <span>{isSubmittingPost ? 'Publicando...' : 'Publicar Debate'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Search and Category Filters Strip */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        background: '#ffffff',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        borderRadius: '20px',
        padding: '12px 16px',
        boxShadow: 'var(--shadow-card)'
      }}>
        {/* Search Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: '#f5f5f7',
          padding: '8px 12px',
          borderRadius: '12px',
          border: '1px solid rgba(0, 0, 0, 0.04)'
        }}>
          <Search size={15} color="#86868b" />
          <input
            type="text"
            placeholder="Buscar por tema, palabra clave o autor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '12.5px',
              color: '#1d1d1f',
              width: '100%',
              marginLeft: '8px',
              padding: 0
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#86868b' }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '2px',
          scrollbarWidth: 'none'
        }}>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  fontSize: '11.5px',
                  fontWeight: isActive ? 700 : 500,
                  padding: '5px 12px',
                  borderRadius: '999px',
                  border: isActive ? `1.5px solid ${cat.color}` : '1px solid rgba(0, 0, 0, 0.06)',
                  background: isActive ? `${cat.color}15` : '#f5f5f7',
                  color: isActive ? cat.color : '#6e6e73',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feed Posts List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredPosts.length === 0 ? (
          <div style={{
            background: '#ffffff',
            border: '1px solid rgba(0, 0, 0, 0.06)',
            borderRadius: '24px',
            padding: '48px 24px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-card)'
          }}>
            <MessageSquare size={36} color="#0d9488" style={{ margin: '0 auto 12px', opacity: 0.8 }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1d1d1f', margin: '0 0 6px 0' }}>
              No hay debates que coincidan
            </h3>
            <p style={{ fontSize: '12.5px', color: '#6e6e73', maxWidth: '420px', margin: '0 auto 16px', lineHeight: 1.5 }}>
              No se encontraron debates para tu búsqueda o filtro actual. ¡Puedes ser la primera persona en abrir este debate!
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchTerm('');
                if (currentUser) setShowNewPostForm(true);
                else onOpenAuth();
              }}
              className="apple-btn-primary"
              style={{ fontSize: '12px', padding: '6px 14px' }}
            >
              Iniciar un Debate
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const commentsList = Array.isArray(post.comments) ? post.comments : [];
            const commentsCount = typeof post.comments === 'number' ? post.comments : commentsList.length;
            const isLiked = currentUserId && Array.isArray(post.likedBy) 
              ? post.likedBy.includes(currentUserId)
              : false;

            const isAuthor = currentUser && (
              post.userId === currentUserId ||
              post.author?.toLowerCase() === currentUser.name?.toLowerCase() ||
              currentUser.isAdmin
            );

            const isExpanded = !!expandedComments[post.id];

            return (
              <div
                key={post.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  borderRadius: '22px',
                  padding: '20px',
                  boxShadow: 'var(--shadow-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                }}
              >
                {/* Author Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={getSafeAvatarUrl(post.avatar, post.author)}
                      alt={post.author}
                      style={{ width: '38px', height: '38px', borderRadius: '12px', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1d1d1f' }}>
                          {post.author}
                        </span>
                        {post.role?.includes('Empresa') && (
                          <span style={{
                            fontSize: '9.5px',
                            fontWeight: 800,
                            padding: '1px 6px',
                            borderRadius: '4px',
                            background: '#e0f2fe',
                            color: '#0284c7'
                          }}>
                            EMPRESA
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '11.5px', color: '#86868b' }}>
                        {post.role} • {post.timeAgo || 'Reciente'}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: 700,
                      color: '#0f766e',
                      background: '#f0fdfa',
                      border: '1px solid #ccfbf1',
                      borderRadius: '999px',
                      padding: '2px 9px',
                      whiteSpace: 'nowrap'
                    }}>
                      {post.tag || post.category || 'General'}
                    </span>

                    {/* Delete post button if author or admin */}
                    {isAuthor && (
                      <button
                        onClick={() => {
                          if (window.confirm('¿Seguro que deseas eliminar este debate de la comunidad?')) {
                            onDeletePost(post.id);
                          }
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: '4px',
                          cursor: 'pointer',
                          color: '#a1a1a6',
                          transition: 'color 0.15s ease'
                        }}
                        title="Eliminar debate"
                        onMouseEnter={(e) => e.currentTarget.style.color = '#e11d48'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#a1a1a6'}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Title & Body Content */}
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1d1d1f', margin: '0 0 6px 0', letterSpacing: '-0.01em', lineHeight: 1.4 }}>
                    {post.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#3a3a3c', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-line' }}>
                    {post.content}
                  </p>
                </div>

                {/* Bottom Action Bar */}
                <div style={{
                  marginTop: '4px',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(0, 0, 0, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  color: '#86868b'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Like button */}
                    <button
                      onClick={() => handleLikeClick(post.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: isLiked ? '#ffe4e6' : '#f5f5f7',
                        color: isLiked ? '#e11d48' : '#52525b',
                        padding: '5px 12px',
                        borderRadius: '999px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: isLiked ? 700 : 500,
                        fontSize: '12px',
                        transition: 'all 0.15s ease'
                      }}
                      title={isLiked ? 'Ya no me gusta' : 'Me gusta'}
                    >
                      <Heart 
                        size={14} 
                        color={isLiked ? '#e11d48' : '#71717a'} 
                        fill={isLiked ? '#e11d48' : 'none'} 
                      />
                      <span>{post.likes || 0}</span>
                    </button>

                    {/* Toggle Comments Button */}
                    <button
                      onClick={() => toggleComments(post.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: isExpanded ? '#f0fdfa' : '#f5f5f7',
                        color: isExpanded ? '#0d9488' : '#52525b',
                        padding: '5px 12px',
                        borderRadius: '999px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: isExpanded ? 700 : 500,
                        fontSize: '12px',
                        transition: 'all 0.15s ease'
                      }}
                      title="Ver y agregar respuestas"
                    >
                      <MessageSquare size={14} color={isExpanded ? '#0d9488' : '#71717a'} />
                      <span>{commentsCount} {commentsCount === 1 ? 'respuesta' : 'respuestas'}</span>
                    </button>
                  </div>

                  <span style={{ fontSize: '11px', color: '#6e6e73', background: '#f5f5f7', padding: '2px 8px', borderRadius: '6px', fontWeight: 500 }}>
                    {post.category}
                  </span>
                </div>

                {/* Collapsible Comments Section */}
                {isExpanded && (
                  <div style={{
                    marginTop: '6px',
                    paddingTop: '14px',
                    borderTop: '1px dashed rgba(0, 0, 0, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    {/* Comments list */}
                    {commentsList.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {commentsList.map((comm) => {
                          const isCommAuthor = currentUser && (
                            comm.userId === currentUserId ||
                            comm.author?.toLowerCase() === currentUser.name?.toLowerCase() ||
                            currentUser.isAdmin
                          );

                          return (
                            <div
                              key={comm.id}
                              style={{
                                background: '#f8fafc',
                                border: '1px solid rgba(0, 0, 0, 0.04)',
                                borderRadius: '14px',
                                padding: '10px 14px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '4px'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <img
                                    src={getSafeAvatarUrl(comm.avatar, comm.author)}
                                    alt={comm.author}
                                    style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }}
                                  />
                                  <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#1d1d1f' }}>
                                    {comm.author}
                                  </span>
                                  {comm.role && (
                                    <span style={{ fontSize: '10.5px', color: '#86868b' }}>
                                      • {comm.role}
                                    </span>
                                  )}
                                  <span style={{ fontSize: '10px', color: '#a1a1a6' }}>
                                    • {comm.timeAgo || 'Hace un momento'}
                                  </span>
                                </div>

                                {isCommAuthor && (
                                  <button
                                    onClick={() => {
                                      if (window.confirm('¿Deseas eliminar este comentario?')) {
                                        onDeleteComment(post.id, comm.id);
                                      }
                                    }}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a1a1a6', padding: '2px' }}
                                    title="Eliminar respuesta"
                                  >
                                    <Trash2 size={11} />
                                  </button>
                                )}
                              </div>

                              <p style={{ fontSize: '12.5px', color: '#334155', lineHeight: 1.5, margin: '2px 0 0 34px' }}>
                                {comm.content}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p style={{ fontSize: '12px', color: '#86868b', fontStyle: 'italic', margin: '4px 0' }}>
                        Aún no hay respuestas en este debate. ¡Sé el primero en aportar tu perspectiva!
                      </p>
                    )}

                    {/* Inline Comment Input Box */}
                    <form
                      onSubmit={(e) => handleCommentSubmit(post.id, e)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginTop: '4px'
                      }}
                    >
                      <img
                        src={currentUser ? currentAuthorAvatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
                        alt={currentAuthorName}
                        style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                      />

                      <div style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        background: '#f1f5f9',
                        borderRadius: '999px',
                        padding: '4px 6px 4px 14px',
                        border: '1px solid rgba(0, 0, 0, 0.06)'
                      }}>
                        <input
                          type="text"
                          placeholder={currentUser ? "Escribe una respuesta o recomendación..." : "Inicia sesión para responder..."}
                          value={commentInputs[post.id] || ''}
                          onClick={() => {
                            if (!currentUser) onOpenAuth();
                          }}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCommentInputs((prev) => ({ ...prev, [post.id]: val }));
                          }}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            outline: 'none',
                            fontSize: '12px',
                            width: '100%',
                            color: '#1d1d1f'
                          }}
                        />

                        <button
                          type="submit"
                          disabled={submittingComment[post.id] || !(commentInputs[post.id] || '').trim()}
                          style={{
                            background: (commentInputs[post.id] || '').trim() ? '#0d9488' : '#cbd5e1',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '50%',
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: (commentInputs[post.id] || '').trim() ? 'pointer' : 'default',
                            transition: 'all 0.15s ease'
                          }}
                          title="Enviar respuesta"
                        >
                          <Send size={12} />
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
