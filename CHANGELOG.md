# Changelog - CryptoCompass

## [2026-02-04] - Portfolio Builder Added

### Added
- ✅ **Portfolio Builder Component** (`components/PortfolioBuilder.tsx`)
  - 3 типа портфелей: Conservative, Balanced, Aggressive
  - Интерактивный выбор типа портфеля с визуальными карточками
  - Калькулятор инвестиций с предустановленными суммами
  - Автоматический расчет распределения криптовалют
  - Визуализация с цветной шкалой процентов
  - Детальная разбивка для каждой криптовалюты:
    - Текущая цена из CoinGecko API
    - Сумма инвестиции
    - Количество монет для покупки
  - Автообновление цен каждую минуту
  - Disclaimer о рисках инвестиций

### Modified
- 📝 **app/page.tsx**
  - Добавлен импорт PortfolioBuilder
  - Интегрирован компонент после таблицы криптовалют
  - Компонент отображается только когда загружены данные

### Documentation
- 📚 **PORTFOLIO_BUILDER.md** - Полная документация компонента
- 📝 **CHANGELOG.md** - История изменений

### Technical Details
- **TypeScript** - полная типизация
- **Tailwind CSS** - dark theme совместимый с проектом
- **API Integration** - использует `/api/prices` endpoint
- **Real-time Updates** - актуальные цены криптовалют
- **Responsive Design** - адаптивный дизайн для всех устройств

### Build Status
✅ Build successful
✅ TypeScript check passed
✅ No errors or warnings
✅ Dev server running on http://localhost:3000

### Portfolio Types

#### Conservative (Low Risk)
- 60% BTC, 30% ETH, 10% Stablecoins
- Для долгосрочных инвесторов

#### Balanced (Medium Risk)
- 40% BTC, 30% ETH, 20% SOL, 10% Other
- Баланс стабильности и роста

#### Aggressive (High Risk)
- 30% BTC, 25% ETH, 25% SOL, 20% Altcoins
- Максимальный потенциал роста

### Next Steps (Future Improvements)
- [ ] Custom portfolio creator
- [ ] Save/load portfolios
- [ ] Export to CSV/PDF
- [ ] Historical performance tracking
- [ ] Integration with exchanges API
- [ ] Multi-currency support (EUR, GBP, etc.)
