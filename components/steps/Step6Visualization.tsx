import React from 'react';
import StepHeader from '../StepHeader';

const Step6Visualization: React.FC = () => {
  // Координаты центра Москвы и уровень масштабирования
  // Параметр l=map,trf включает слой карты и слой пробок (traffic)
  const mapUrl = "https://yandex.ru/map-widget/v1/?ll=37.6176%2C55.7558&z=11&l=map%2Ctrf";

  return (
    <div>
      <StepHeader stepId={6} />
      <div className="card-modern glow-border p-6">
        <h3 className="text-xl font-semibold mb-4 text-cyan-300">Интерактивная карта дорожной обстановки</h3>
        <p className="text-slate-400 mb-4 text-sm">
          На карте в реальном времени отображается информация о пробках, полученная из внешней системы мониторинга трафика. 
          Зеленый цвет означает свободное движение, а оттенки от желтого до темно-красного — затрудненное движение и серьезные заторы.
        </p>
        <div className="relative w-full h-[65vh] rounded-lg overflow-hidden border-2 border-slate-700/80 bg-slate-900">
          <iframe
            src={mapUrl}
            style={{
              position: 'absolute',
              top: '-60px', // Скрывает верхнюю панель
              left: '0', // Слева нет элементов для скрытия
              // Увеличиваем ширину, чтобы элементы справа вышли за пределы видимости
              width: 'calc(100% + 50px)',
              // Увеличиваем высоту, чтобы скрыть верхнюю и нижнюю панели
              height: 'calc(100% + 100px)',
              border: 0,
            }}
            loading="lazy"
            title="Интерактивная карта трафика"
            sandbox="allow-scripts allow-same-origin allow-popups"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Step6Visualization;