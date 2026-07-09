const mockPaintings = [
    { id: '1', title: 'Ethereal Dawn', year: '2024', medium: 'Oil on Canvas', image: '', category: 'landscapes', palette: 'warm', style: 'realism' },
    { id: '2', title: 'Silent Whisper', year: '2023', medium: 'Acrylic & Sand', image: '', category: 'abstract', palette: 'neutral', style: '2d' },
    { id: '3', title: 'Midnight Ochre', month: 'January', year: '2025', medium: 'Oil on Linen', image: '', category: 'portraits', palette: 'cool', style: 'realism' },
    { id: '4', title: 'Crimson Tide', year: '2024', medium: 'Oil on Canvas', image: '', category: 'abstract', palette: 'warm', style: '2d' },
    { id: '5', title: 'Winter Veil', month: 'December', year: '2025', medium: 'Charcoal & Acrylic', image: '', category: 'landscapes', palette: 'cool', style: 'realism' },
];

const res = mockPaintings.sort((a, b) => {
      const dateStringA = a.month ? `${a.month} ${a.year}` : a.year;
      const dateStringB = b.month ? `${b.month} ${b.year}` : b.year;
      
      const dateA = new Date(dateStringA).getTime();
      const dateB = new Date(dateStringB).getTime();
      
      if (!isNaN(dateA) && !isNaN(dateB)) {
        return dateB - dateA;
      }
      return dateStringB.localeCompare(dateStringA);
});
console.log(res.map(p => p.title));
