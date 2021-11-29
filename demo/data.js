const generateRecord = (i) => ({
  id: i,
  orgId: 6609 + (Math.round(Math.random() * 3) - 3),
  grade: Math.min(Math.round((Math.random() * 50) + (Math.random() * 50)), 100),
  timeInContent: (Math.random() * 60) * (Math.floor(Math.random() * 6) + 1),
  gradeHistory: Array(3).fill(0).map((_, j) => ({ grade: Math.floor(Math.random() * 25) + Math.floor(Math.random() * 25) + 50, date: j})),
})

let _data = Array(50).fill(0).map((_, i) => generateRecord(i));

export const data = () => {

  const newD = _data.map(d => {
    const ticChange = Math.round(Math.random() * 5);
    const gradeChange = (Math.round(Math.random() * 5)) - 2;
    d.gradeHistory.push({ grade: Math.floor(Math.random() * 25) + Math.floor(Math.random() * 25) + 50, date: d.gradeHistory.length});
    return {
      ...d,
      grade: Math.min(Math.max(d.grade + gradeChange, 0), 100),
      timeInContent: d.timeInContent + ticChange,
    }
  })

  _data = newD;
  return newD;
};
