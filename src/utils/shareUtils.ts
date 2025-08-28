// Utils for sharing functionality

export const generateReferralLink = (userId: string) => {
  return `${window.location.origin}/register?ref=${userId}`;
};

export const shareToWhatsApp = (userId: string) => {
  const link = generateReferralLink(userId);
  const message = `Olá! Indique imóveis e ganhe comissões com a San Remo Imóveis. Use meu link de indicação: ${link}`;
  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
};

export const shareToFacebook = (userId: string) => {
  const link = generateReferralLink(userId);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`, '_blank');
};

export const shareToInstagram = (userId: string) => {
  const link = generateReferralLink(userId);
  // Instagram doesn't support direct URL sharing, so we copy to clipboard
  navigator.clipboard.writeText(`Indique imóveis e ganhe comissões! ${link}`);
  alert('Link copiado para o clipboard! Cole no Instagram.');
};

export const downloadCSV = (data: any[], filename: string) => {
  if (!data.length) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};