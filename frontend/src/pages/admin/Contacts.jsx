import React, { useState, useEffect } from 'react';
import { Trash2, Mail, Phone, Calendar } from 'lucide-react';
import { getAdminContacts, updateContactStatus, deleteContact } from '../../services/adminApi';
import { toast } from '../../hooks/use-toast';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const data = await getAdminContacts();
      setContacts(data);
    } catch (error) {
      toast({
        title: "Hata",
        description: "Mesajlar yüklenirken bir hata oluştu.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (contactId, newStatus) => {
    try {
      await updateContactStatus(contactId, newStatus);
      toast({
        title: "Başarılı",
        description: "Mesaj durumu güncellendi.",
      });
      fetchContacts();
    } catch (error) {
      toast({
        title: "Hata",
        description: "Durum güncellenirken bir hata oluştu.",
      });
    }
  };

  const handleDelete = async (contactId) => {
    if (window.confirm('Bu mesajı silmek istediğinize emin misiniz?')) {
      try {
        await deleteContact(contactId);
        toast({
          title: "Başarılı",
          description: "Mesaj silindi.",
        });
        fetchContacts();
      } catch (error) {
        toast({
          title: "Hata",
          description: "Mesaj silinirken bir hata oluştu.",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">İletişim Mesajları</h1>
        <p className="text-gray-600 mt-1">{contacts.length} mesaj bulundu</p>
      </div>

      <div className="grid gap-4">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{contact.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    contact.status === 'new' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {contact.status === 'new' ? 'Yeni' : 'Cevaplandı'}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Mail className="h-4 w-4" />
                    <span>{contact.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Phone className="h-4 w-4" />
                    <span>{contact.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(contact.created_at).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <div className="text-gray-700">
                    <span className="font-semibold">Konu:</span> {contact.subject}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-gray-800 leading-relaxed">{contact.message}</p>
                </div>

                <div className="flex items-center space-x-4">
                  <select
                    value={contact.status}
                    onChange={(e) => handleStatusChange(contact.id, e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="new">Yeni</option>
                    <option value="replied">Cevaplandı</option>
                  </select>

                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Sil</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {contacts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <p className="text-gray-500">Henüz mesaj bulunmuyor.</p>
        </div>
      )}
    </div>
  );
};

export default Contacts;