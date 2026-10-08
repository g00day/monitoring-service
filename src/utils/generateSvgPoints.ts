const generateSvgPoints = (
  points: any[], 
  valueExtractor: (point: any) => number | null
): string => {
  if (!points || points.length === 0) return "";

  const totalPoints = points.length;
  const svgWidth = 500;
  const svgHeight = 100;
  const paddingY = 10; // Чтобы линия не прилипала к краям сетки (Y: 10 - 90)
  const chartAreaHeight = svgHeight - paddingY * 2; // 80px рабочая высота для 0-100%

  return points
    .map((point, index) => {
      const val = valueExtractor(point);
      if (val === null) return null; // Пропускаем интервалы без измерений

      // Расчет X: равномерно распределяем точки по ширине 500px
      const x = totalPoints > 1 ? (index / (totalPoints - 1)) * svgWidth : 0;

      // Расчет Y: инвертируем, так как в SVG 0 — это верх, а 100% загрузки должно быть вверху (Y = 10)
      // Ограничиваем значения от 0 до 100
      const clampedVal = Math.max(0, Math.min(100, val));
      const y = svgHeight - paddingY - (clampedVal / 100) * chartAreaHeight;

      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .filter(Boolean) // Удаляем null-интервалы
    .join(" ");
};


export default generateSvgPoints;