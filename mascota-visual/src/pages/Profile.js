import React, { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile } from '../api';

function Profile({ token }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile(token);
        setUser(data);
        setForm({ name: data.username, email: data.email });
      } catch (err) {
        setError('Error al cargar perfil.');
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchProfile();
  }, [token]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleEdit = () => setEdit(true);
  const handleCancel = () => { setEdit(false); setForm({ name: user.username, email: user.email }); };
  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const updated = await updateUserProfile(token, { username: form.name, email: form.email });
      setUser(updated);
      setEdit(false);
      setSuccess('¡Perfil actualizado!');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="profile-page"><h2>Perfil de Usuario</h2><p>Cargando...</p></div>;
  if (error) return <div className="profile-page"><h2>Perfil de Usuario</h2><p style={{ color: 'red' }}>{error}</p></div>;

  return (
    <div className="profile-page">
      <h2>Perfil de Usuario</h2>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="profile-info">
        <div><b>Nombre:</b> {edit ? <input name="name" value={form.name} onChange={handleChange} /> : user.username}</div>
        <div><b>Email:</b> {edit ? <input name="email" value={form.email} onChange={handleChange} /> : user.email}</div>
        <div><b>Monedas:</b> {user.coins ?? 0} 🪙</div>
        <div><b>Mascotas:</b> {user.mascotas?.length ?? 0}</div>
        <div><b>Héroes:</b> {user.heroes?.length ?? 0}</div>
      </div>
      {edit ? (
        <>
          <button onClick={handleSave} disabled={saving}>Guardar</button>
          <button onClick={handleCancel}>Cancelar</button>
        </>
      ) : (
        <button onClick={handleEdit}>Editar</button>
      )}
    </div>
  );
}

export default Profile; 