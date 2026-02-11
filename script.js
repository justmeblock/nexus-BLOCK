// ─── NEXUS Crypto Terminal — Script ─────────────────────────────────

// ─── Mock Data ──────────────────────────────────────────────────────

const COINS = [
  { symbol: 'BTC', name: 'Bitcoin', pair: 'BTC/USDT', price: 97234.50, change: 1.84, color: '#f7931a', icon: '₿' },
  { symbol: 'ETH', name: 'Ethereum', pair: 'ETH/USDT', price: 3412.80, change: 3.21, color: '#627eea', icon: 'Ξ' },
  { symbol: 'SOL', name: 'Solana', pair: 'SOL/USDT', price: 198.45, change: -2.15, color: '#9945ff', icon: 'S' },
  { symbol: 'BNB', name: 'BNB', pair: 'BNB/USDT', price: 612.30, change: 0.87, color: '#f3ba2f', icon: 'B' },
  { symbol: 'XRP', name: 'Ripple', pair: 'XRP/USDT', price: 2.34, change: -0.54, color: '#00aae4', icon: 'X' },
  { symbol: 'ADA', name: 'Cardano', pair: 'ADA/USDT', price: 0.892, change: 5.12, color: '#0033ad', icon: 'A' },
  { symbol: 'AVAX', name: 'Avalanche', pair: 'AVAX/USDT', price: 38.67, change: -1.33, color: '#e84142', icon: 'Λ' },
  { symbol: 'DOT', name: 'Polkadot', pair: 'DOT/USDT', price: 7.45, change: 2.08, color: '#e6007a', icon: '●' },
  { symbol: 'LINK', name: 'Chainlink', pair: 'LINK/USDT', price: 18.92, change: 1.45, color: '#2a5ada', icon: '⬡' },
  { symbol: 'DOGE', name: 'Dogecoin', pair: 'DOGE/USDT', price: 0.342, change: -3.67, color: '#c2a633', icon: 'Ð' },
  { symbol: 'MATIC', name: 'Polygon', pair: 'MATIC/USDT', price: 0.567, change: 0.23, color: '#8247e5', icon: 'M' },
  { symbol: 'UNI', name: 'Uniswap', pair: 'UNI/USDT', price: 12.34, change: 4.56, color: '#ff007a', icon: '🦄' },
];

let selectedCoin = 0;

// ─── Generate sparkline data ────────────────────────────────────────

function generateSparklineData(trend, volatility, points) {
  const data = [];
  let value = 50;
  for (let i = 0; i < points; i++) {
    value += (Math.random() - 0.5 + trend * 0.03) * volatility;
    value = Math.max(10, Math.min(90, value));
    data.push(value);
  }
  return data;
}

COINS.forEach(coin => {
  coin.sparkline = generateSparklineData(coin.change > 0 ? 1 : -1, 5, 40);
});

// ─── Generate candlestick data ──────────────────────────────────────

function generateCandleData(basePrice, count) {
  const candles = [];
  let price = basePrice * 0.96;
  for (let i = 0; i < count; i++) {
    const open = price;
    const change = (Math.random() - 0.48) * basePrice * 0.012;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * basePrice * 0.005;
    const low = Math.min(open, close) - Math.random() * basePrice * 0.005;
    const volume = Math.random() * 100 + 20;
    candles.push({ open, high, low, close, volume });
    price = close;
  }
  return candles;
}

let candleData = generateCandleData(97234.50, 80);

// ─── Generate order book data ───────────────────────────────────────

function generateOrderBook(midPrice) {
  const asks = [];
  const bids = [];
  let askPrice = midPrice + 5;
  let bidPrice = midPrice - 5;

  for (let i = 0; i < 12; i++) {
    const askAmount = (Math.random() * 2 + 0.1).toFixed(4);
    askPrice += Math.random() * 15 + 2;
    asks.push({ price: askPrice.toFixed(2), amount: askAmount, total: (askPrice * parseFloat(askAmount)).toFixed(2) });
  }

  for (let i = 0; i < 12; i++) {
    const bidAmount = (Math.random() * 2 + 0.1).toFixed(4);
    bidPrice -= Math.random() * 15 + 2;
    bids.push({ price: bidPrice.toFixed(2), amount: bidAmount, total: (bidPrice * parseFloat(bidAmount)).toFixed(2) });
  }

  return { asks: asks.reverse(), bids };
}

let orderBook = generateOrderBook(97234.50);

// ─── Generate trades ────────────────────────────────────────────────

function generateTrade() {
  const pairs = [
    { pair: 'BTC/USDT', basePrice: 97234.50, symbol: 'BTC' },
    { pair: 'ETH/USDT', basePrice: 3412.80, symbol: 'ETH' },
    { pair: 'SOL/USDT', basePrice: 198.45, symbol: 'SOL' },
  ];
  const p = pairs[Math.floor(Math.random() * pairs.length)];
  const side = Math.random() > 0.48 ? 'buy' : 'sell';
  const priceVar = p.basePrice * (1 + (Math.random() - 0.5) * 0.002);
  const amount = p.symbol === 'BTC'
    ? (Math.random() * 1.5 + 0.001).toFixed(4)
    : p.symbol === 'ETH'
      ? (Math.random() * 10 + 0.01).toFixed(3)
      : (Math.random() * 50 + 0.1).toFixed(2);
  const now = new Date();
  const time = now.toTimeString().slice(0, 8);

  return {
    pair: p.pair,
    symbol: p.symbol,
    side,
    price: priceVar.toFixed(2),
    amount,
    total: (priceVar * parseFloat(amount)).toFixed(2),
    time,
  };
}

let trades = [];
for (let i = 0; i < 25; i++) {
  trades.push(generateTrade());
}

// ─── Render Watchlist ───────────────────────────────────────────────

function renderWatchlist() {
  const container = document.getElementById('watchlist');
  container.innerHTML = '';

  COINS.forEach((coin, idx) => {
    const isActive = idx === selectedCoin;
    const isGain = coin.change >= 0;

    const item = document.createElement('div');
    item.className = `watchlist-item flex items-center justify-between px-4 py-2.5 ${isActive ? 'active' : ''} border-l-2 ${isActive ? '' : 'border-transparent'}`;
    item.onclick = () => { selectedCoin = idx; renderWatchlist(); updateChartForCoin(); };

    item.innerHTML = `
      <div class="flex items-center gap-2.5 min-w-0">
        <div class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0" style="background: ${coin.color}20; color: ${coin.color};">${coin.icon}</div>
        <div class="min-w-0">
          <div class="text-xs font-mono font-medium text-white">${coin.symbol}</div>
          <div class="text-[9px] font-mono text-muted truncate">${coin.name}</div>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <canvas class="sparkline-canvas" width="48" height="20" data-coin="${idx}"></canvas>
        <div class="text-right">
          <div class="text-[11px] font-mono text-white tabular">${formatPrice(coin.price)}</div>
          <div class="text-[10px] font-mono tabular ${isGain ? 'text-gain' : 'text-loss'}">${isGain ? '+' : ''}${coin.change.toFixed(2)}%</div>
        </div>
      </div>
    `;
    container.appendChild(item);
  });

  // Draw sparklines
  COINS.forEach((coin, idx) => {
    const canvas = document.querySelector(`canvas[data-coin="${idx}"]`);
    if (canvas) drawSparkline(canvas, coin.sparkline, coin.change >= 0);
  });
}

function drawSparkline(canvas, data, isGain) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  // Gradient fill
  const gradient = ctx.createLinearGradient(0, 0, 0, h);
  if (isGain) {
    gradient.addColorStop(0, 'rgba(13, 255, 138, 0.15)');
    gradient.addColorStop(1, 'rgba(13, 255, 138, 0)');
  } else {
    gradient.addColorStop(0, 'rgba(255, 59, 106, 0.15)');
    gradient.addColorStop(1, 'rgba(255, 59, 106, 0)');
  }

  ctx.beginPath();
  data.forEach((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  // Fill
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  // Stroke
  ctx.beginPath();
  data.forEach((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = isGain ? '#0dff8a' : '#ff3b6a';
  ctx.lineWidth = 1.2;
  ctx.stroke();
}

// ─── Render Candlestick Chart ───────────────────────────────────────

function renderCandleChart() {
  const canvas = document.getElementById('chart-canvas');
  const container = document.getElementById('chart-area');
  const rect = container.getBoundingClientRect();

  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = rect.height * window.devicePixelRatio;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';

  const ctx = canvas.getContext('2d');
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  const w = rect.width;
  const h = rect.height;

  ctx.clearRect(0, 0, w, h);

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
  bgGrad.addColorStop(0, '#0d0f14');
  bgGrad.addColorStop(1, '#08090c');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  const data = candleData;
  const padding = { top: 30, right: 70, bottom: 60, left: 15 };
  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;

  // Price range
  const allHighs = data.map(d => d.high);
  const allLows = data.map(d => d.low);
  const minPrice = Math.min(...allLows) * 0.9998;
  const maxPrice = Math.max(...allHighs) * 1.0002;
  const priceRange = maxPrice - minPrice;

  const candleWidth = Math.max(2, (chartW / data.length) * 0.65);
  const gap = chartW / data.length;

  // Grid lines
  ctx.strokeStyle = '#1e233020';
  ctx.lineWidth = 1;
  const gridSteps = 6;
  for (let i = 0; i <= gridSteps; i++) {
    const y = padding.top + (i / gridSteps) * chartH;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(w - padding.right, y);
    ctx.stroke();

    // Price labels
    const price = maxPrice - (i / gridSteps) * priceRange;
    ctx.fillStyle = '#4a5068';
    ctx.font = '10px JetBrains Mono';
    ctx.textAlign = 'left';
    ctx.fillText(formatPriceShort(price), w - padding.right + 8, y + 3);
  }

  // Volume bars (background)
  const maxVol = Math.max(...data.map(d => d.volume));
  const volHeight = chartH * 0.15;

  data.forEach((candle, i) => {
    const x = padding.left + i * gap + gap / 2;
    const isBull = candle.close >= candle.open;
    const volH = (candle.volume / maxVol) * volHeight;
    const volY = padding.top + chartH - volH;

    ctx.fillStyle = isBull ? 'rgba(13, 255, 138, 0.08)' : 'rgba(255, 59, 106, 0.08)';
    ctx.fillRect(x - candleWidth / 2, volY, candleWidth, volH);
  });

  // EMA line (20-period overlay)
  const emaPeriod = 20;
  const emaValues = [];
  let emaMultiplier = 2 / (emaPeriod + 1);
  data.forEach((candle, i) => {
    if (i === 0) {
      emaValues.push(candle.close);
    } else if (i < emaPeriod) {
      // SMA for initial values
      const sum = data.slice(0, i + 1).reduce((s, c) => s + c.close, 0);
      emaValues.push(sum / (i + 1));
    } else {
      emaValues.push((candle.close - emaValues[i - 1]) * emaMultiplier + emaValues[i - 1]);
    }
  });

  ctx.beginPath();
  ctx.strokeStyle = '#00e5ff40';
  ctx.lineWidth = 1.5;
  emaValues.forEach((val, i) => {
    const x = padding.left + i * gap + gap / 2;
    const y = padding.top + ((maxPrice - val) / priceRange) * chartH;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Bollinger bands (simplified)
  const bbPeriod = 20;
  const bbUpper = [];
  const bbLower = [];
  data.forEach((candle, i) => {
    if (i < bbPeriod) {
      bbUpper.push(null);
      bbLower.push(null);
      return;
    }
    const slice = data.slice(i - bbPeriod, i);
    const mean = slice.reduce((s, c) => s + c.close, 0) / bbPeriod;
    const stdDev = Math.sqrt(slice.reduce((s, c) => s + Math.pow(c.close - mean, 2), 0) / bbPeriod);
    bbUpper.push(mean + stdDev * 2);
    bbLower.push(mean - stdDev * 2);
  });

  // Upper band
  ctx.beginPath();
  ctx.strokeStyle = '#4a506820';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  bbUpper.forEach((val, i) => {
    if (val === null) return;
    const x = padding.left + i * gap + gap / 2;
    const y = padding.top + ((maxPrice - val) / priceRange) * chartH;
    if (i === bbPeriod) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Lower band
  ctx.beginPath();
  bbLower.forEach((val, i) => {
    if (val === null) return;
    const x = padding.left + i * gap + gap / 2;
    const y = padding.top + ((maxPrice - val) / priceRange) * chartH;
    if (i === bbPeriod) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.setLineDash([]);

  // Band fill
  ctx.beginPath();
  const fillStart = bbPeriod;
  for (let i = fillStart; i < data.length; i++) {
    if (bbUpper[i] === null) continue;
    const x = padding.left + i * gap + gap / 2;
    const y = padding.top + ((maxPrice - bbUpper[i]) / priceRange) * chartH;
    if (i === fillStart) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  for (let i = data.length - 1; i >= fillStart; i--) {
    if (bbLower[i] === null) continue;
    const x = padding.left + i * gap + gap / 2;
    const y = padding.top + ((maxPrice - bbLower[i]) / priceRange) * chartH;
    ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(0, 229, 255, 0.02)';
  ctx.fill();

  // Candlesticks
  data.forEach((candle, i) => {
    const x = padding.left + i * gap + gap / 2;
    const isBull = candle.close >= candle.open;

    const openY = padding.top + ((maxPrice - candle.open) / priceRange) * chartH;
    const closeY = padding.top + ((maxPrice - candle.close) / priceRange) * chartH;
    const highY = padding.top + ((maxPrice - candle.high) / priceRange) * chartH;
    const lowY = padding.top + ((maxPrice - candle.low) / priceRange) * chartH;

    // Wick
    ctx.strokeStyle = isBull ? '#0dff8a' : '#ff3b6a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, highY);
    ctx.lineTo(x, lowY);
    ctx.stroke();

    // Body
    const bodyTop = Math.min(openY, closeY);
    const bodyHeight = Math.max(Math.abs(closeY - openY), 1);

    if (isBull) {
      const bodyGrad = ctx.createLinearGradient(0, bodyTop, 0, bodyTop + bodyHeight);
      bodyGrad.addColorStop(0, '#15ff93');
      bodyGrad.addColorStop(1, '#0dca6e');
      ctx.fillStyle = bodyGrad;
    } else {
      const bodyGrad = ctx.createLinearGradient(0, bodyTop, 0, bodyTop + bodyHeight);
      bodyGrad.addColorStop(0, '#ff5580');
      bodyGrad.addColorStop(1, '#cc2850');
      ctx.fillStyle = bodyGrad;
    }
    ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);

    // Subtle glow on last candle
    if (i === data.length - 1) {
      ctx.shadowBlur = 8;
      ctx.shadowColor = isBull ? '#0dff8a40' : '#ff3b6a40';
      ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
      ctx.shadowBlur = 0;
    }
  });

  // Current price line
  const lastCandle = data[data.length - 1];
  const currentY = padding.top + ((maxPrice - lastCandle.close) / priceRange) * chartH;
  const isBullLast = lastCandle.close >= lastCandle.open;

  ctx.strokeStyle = isBullLast ? '#0dff8a50' : '#ff3b6a50';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(padding.left, currentY);
  ctx.lineTo(w - padding.right, currentY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Price tag on right
  const tagColor = isBullLast ? '#0dff8a' : '#ff3b6a';
  ctx.fillStyle = tagColor;
  const tagW = 65;
  const tagH = 18;
  roundRect(ctx, w - padding.right + 2, currentY - tagH / 2, tagW, tagH, 3);
  ctx.fill();
  ctx.fillStyle = '#08090c';
  ctx.font = 'bold 9px JetBrains Mono';
  ctx.textAlign = 'center';
  ctx.fillText(formatPriceShort(lastCandle.close), w - padding.right + 2 + tagW / 2, currentY + 3);

  // Time labels
  ctx.fillStyle = '#4a5068';
  ctx.font = '9px JetBrains Mono';
  ctx.textAlign = 'center';
  const timeStep = Math.ceil(data.length / 8);
  for (let i = 0; i < data.length; i += timeStep) {
    const x = padding.left + i * gap + gap / 2;
    const hour = (8 + i) % 24;
    ctx.fillText(`${hour.toString().padStart(2, '0')}:00`, x, h - padding.bottom + 18);
  }

  // Legend
  ctx.fillStyle = '#4a5068';
  ctx.font = '9px JetBrains Mono';
  ctx.textAlign = 'left';
  ctx.fillText('EMA(20)', padding.left + 8, padding.top + 12);
  ctx.fillStyle = '#00e5ff40';
  ctx.fillRect(padding.left + 58, padding.top + 7, 16, 2);
  ctx.fillStyle = '#4a5068';
  ctx.fillText('BB(20,2)', padding.left + 84, padding.top + 12);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ─── Render Order Book ──────────────────────────────────────────────

function renderOrderBook() {
  const asksContainer = document.getElementById('asks-container');
  const bidsContainer = document.getElementById('bids-container');

  const maxAskTotal = Math.max(...orderBook.asks.map(a => parseFloat(a.total)));
  const maxBidTotal = Math.max(...orderBook.bids.map(b => parseFloat(b.total)));

  // Asks (sells) - red
  asksContainer.innerHTML = orderBook.asks.map(ask => {
    const pct = (parseFloat(ask.total) / maxAskTotal) * 100;
    return `
      <div class="ob-row grid grid-cols-3 px-4 py-0.5 text-[11px] font-mono tabular relative" style="cursor: pointer;">
        <div class="absolute inset-0 pointer-events-none" style="background: linear-gradient(270deg, rgba(255,59,106,${pct / 800}), transparent); width: ${pct}%; right: 0; left: auto;"></div>
        <span class="text-loss relative z-10">${formatPriceShort(parseFloat(ask.price))}</span>
        <span class="text-right text-gray-400 relative z-10">${ask.amount}</span>
        <span class="text-right text-muted relative z-10">${Number(ask.total).toLocaleString()}</span>
      </div>
    `;
  }).join('');

  // Bids (buys) - green
  bidsContainer.innerHTML = orderBook.bids.map(bid => {
    const pct = (parseFloat(bid.total) / maxBidTotal) * 100;
    return `
      <div class="ob-row grid grid-cols-3 px-4 py-0.5 text-[11px] font-mono tabular relative" style="cursor: pointer;">
        <div class="absolute inset-0 pointer-events-none" style="background: linear-gradient(270deg, rgba(13,255,138,${pct / 800}), transparent); width: ${pct}%; right: 0; left: auto;"></div>
        <span class="text-gain relative z-10">${formatPriceShort(parseFloat(bid.price))}</span>
        <span class="text-right text-gray-400 relative z-10">${bid.amount}</span>
        <span class="text-right text-muted relative z-10">${Number(bid.total).toLocaleString()}</span>
      </div>
    `;
  }).join('');
}

// ─── Render Trades ──────────────────────────────────────────────────

function renderTrades() {
  const container = document.getElementById('trades-body');
  container.innerHTML = trades.slice(0, 20).map((trade, idx) => {
    const isBuy = trade.side === 'buy';
    return `
      <div class="grid px-5 py-1 text-[11px] font-mono tabular hover:bg-surface-3 transition-colors ${idx === 0 ? 'trade-enter' : ''}" style="grid-template-columns: 80px 80px 1fr 100px 100px 80px;">
        <span class="flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" style="background: ${getPairColor(trade.symbol)};"></span>
          <span class="text-white">${trade.pair}</span>
        </span>
        <span class="${isBuy ? 'text-gain' : 'text-loss'} uppercase font-medium">${trade.side}</span>
        <span class="${isBuy ? 'text-gain' : 'text-loss'}">${formatPriceShort(parseFloat(trade.price))}</span>
        <span class="text-right text-gray-400">${trade.amount}</span>
        <span class="text-right text-gray-400">$${Number(trade.total).toLocaleString()}</span>
        <span class="text-right text-muted">${trade.time}</span>
      </div>
    `;
  }).join('');
}

function getPairColor(symbol) {
  const colors = { BTC: '#f7931a', ETH: '#627eea', SOL: '#9945ff' };
  return colors[symbol] || '#4a5068';
}

// ─── Formatting helpers ─────────────────────────────────────────────

function formatPrice(price) {
  if (price >= 1000) return '$' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (price >= 1) return '$' + price.toFixed(2);
  return '$' + price.toFixed(3);
}

function formatPriceShort(price) {
  if (price >= 10000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (price >= 1) return price.toFixed(2);
  return price.toFixed(4);
}

// ─── Update chart header for selected coin ──────────────────────────

function updateChartForCoin() {
  const coin = COINS[selectedCoin];
  document.getElementById('main-price').textContent = formatPrice(coin.price);
  document.getElementById('change-24h').textContent = `${coin.change >= 0 ? '+' : ''}${coin.change.toFixed(2)}%`;
  document.getElementById('change-24h').className = `tabular ${coin.change >= 0 ? 'text-gain' : 'text-loss'}`;

  const high = coin.price * (1 + Math.abs(coin.change) / 100 * 0.5);
  const low = coin.price * (1 - Math.abs(coin.change) / 100 * 0.5);
  document.getElementById('high-24h').textContent = formatPrice(high);
  document.getElementById('low-24h').textContent = formatPrice(low);

  document.getElementById('spread-price').textContent = formatPrice(coin.price);

  candleData = generateCandleData(coin.price, 80);
  orderBook = generateOrderBook(coin.price);
  renderCandleChart();
  renderOrderBook();
}

// ─── Live updates (simulated) ───────────────────────────────────────

function simulatePriceUpdate() {
  COINS.forEach(coin => {
    const delta = (Math.random() - 0.49) * coin.price * 0.0005;
    coin.price += delta;
    coin.sparkline.push(coin.sparkline[coin.sparkline.length - 1] + (Math.random() - 0.5) * 3);
    if (coin.sparkline.length > 40) coin.sparkline.shift();
  });

  // Update selected coin display
  const coin = COINS[selectedCoin];
  const priceEl = document.getElementById('main-price');
  const oldText = priceEl.textContent;
  const newText = formatPrice(coin.price);
  if (oldText !== newText) {
    priceEl.textContent = newText;
    priceEl.classList.remove('flash-gain', 'flash-loss');
    void priceEl.offsetWidth;
    priceEl.classList.add(coin.change >= 0 ? 'flash-gain' : 'flash-loss');
  }

  // Update spread price
  document.getElementById('spread-price').textContent = formatPrice(coin.price);

  renderWatchlist();
}

function simulateNewTrade() {
  const trade = generateTrade();
  trades.unshift(trade);
  if (trades.length > 50) trades.pop();
  renderTrades();
}

function simulateOrderBookUpdate() {
  const coin = COINS[selectedCoin];
  // Slightly modify existing order book
  orderBook.asks.forEach(ask => {
    ask.price = (parseFloat(ask.price) + (Math.random() - 0.5) * coin.price * 0.0002).toFixed(2);
    ask.amount = (Math.max(0.001, parseFloat(ask.amount) + (Math.random() - 0.5) * 0.1)).toFixed(4);
    ask.total = (parseFloat(ask.price) * parseFloat(ask.amount)).toFixed(2);
  });
  orderBook.bids.forEach(bid => {
    bid.price = (parseFloat(bid.price) + (Math.random() - 0.5) * coin.price * 0.0002).toFixed(2);
    bid.amount = (Math.max(0.001, parseFloat(bid.amount) + (Math.random() - 0.5) * 0.1)).toFixed(4);
    bid.total = (parseFloat(bid.price) * parseFloat(bid.amount)).toFixed(2);
  });
  renderOrderBook();
}

function simulateCandleUpdate() {
  const coin = COINS[selectedCoin];
  const last = candleData[candleData.length - 1];
  const change = (Math.random() - 0.48) * coin.price * 0.003;
  last.close += change;
  last.high = Math.max(last.high, last.close);
  last.low = Math.min(last.low, last.close);
  last.volume += Math.random() * 2;

  // Occasionally add a new candle
  if (Math.random() < 0.02) {
    const newOpen = last.close;
    const newChange = (Math.random() - 0.48) * coin.price * 0.005;
    const newClose = newOpen + newChange;
    candleData.push({
      open: newOpen,
      close: newClose,
      high: Math.max(newOpen, newClose) + Math.random() * coin.price * 0.002,
      low: Math.min(newOpen, newClose) - Math.random() * coin.price * 0.002,
      volume: Math.random() * 80 + 10,
    });
    if (candleData.length > 80) candleData.shift();
  }

  renderCandleChart();
}

// ─── Clock ──────────────────────────────────────────────────────────

function updateClock() {
  const now = new Date();
  const utc = now.toISOString().slice(11, 19) + ' UTC';
  document.getElementById('server-time').textContent = utc;
  document.getElementById('local-time').textContent = now.toLocaleTimeString();
}

// ─── Portfolio value micro-animation ────────────────────────────────

function animatePortfolio() {
  const el = document.getElementById('portfolio-value');
  const base = 128439.52;
  const delta = (Math.random() - 0.48) * 50;
  const newVal = base + delta;
  el.textContent = '$' + newVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ─── Buy/Sell toggle ────────────────────────────────────────────────

function setupTradeToggle() {
  const btnBuy = document.getElementById('btn-buy');
  const btnSell = document.getElementById('btn-sell');
  const btnSubmit = document.getElementById('btn-submit');

  btnBuy.addEventListener('click', () => {
    btnBuy.style.background = 'linear-gradient(180deg, #15ff93, #0dca6e)';
    btnBuy.style.color = '#08090c';
    btnSell.style.background = '';
    btnSell.classList.add('bg-surface-3');
    btnSell.style.color = '';
    btnSell.classList.add('text-muted');
    btnSubmit.style.background = 'linear-gradient(180deg, #15ff93, #0dca6e)';
    btnSubmit.textContent = `Buy ${COINS[selectedCoin].symbol}`;
  });

  btnSell.addEventListener('click', () => {
    btnSell.style.background = 'linear-gradient(180deg, #ff5580, #cc2850)';
    btnSell.style.color = '#ffffff';
    btnSell.classList.remove('text-muted');
    btnBuy.style.background = '';
    btnBuy.style.color = '';
    btnBuy.classList.add('bg-surface-3', 'text-muted');
    btnSubmit.style.background = 'linear-gradient(180deg, #ff5580, #cc2850)';
    btnSubmit.textContent = `Sell ${COINS[selectedCoin].symbol}`;
  });
}

// ─── Chart crosshair / tooltip ──────────────────────────────────────

function setupChartInteraction() {
  const canvas = document.getElementById('chart-canvas');
  const container = document.getElementById('chart-area');
  const info = document.getElementById('chart-info');
  const infoText = document.getElementById('chart-info-text');

  canvas.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const padding = { left: 15, right: 70 };
    const chartW = rect.width - padding.left - padding.right;
    const gap = chartW / candleData.length;
    const idx = Math.floor((x - padding.left) / gap);

    if (idx >= 0 && idx < candleData.length) {
      const candle = candleData[idx];
      info.style.display = 'block';
      const isBull = candle.close >= candle.open;
      infoText.innerHTML = `
        <span class="text-white">O</span> ${formatPriceShort(candle.open)}
        <span class="text-white ml-2">H</span> ${formatPriceShort(candle.high)}
        <span class="text-white ml-2">L</span> ${formatPriceShort(candle.low)}
        <span class="${isBull ? 'text-gain' : 'text-loss'} ml-2">C</span> ${formatPriceShort(candle.close)}
        <span class="text-muted ml-2">Vol</span> ${candle.volume.toFixed(1)}
      `;
    }
  });

  canvas.addEventListener('mouseleave', () => {
    info.style.display = 'none';
  });
}

// ─── Resize handler ─────────────────────────────────────────────────

let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    renderCandleChart();
  }, 100);
});

// ─── Init ───────────────────────────────────────────────────────────

function init() {
  renderWatchlist();
  renderCandleChart();
  renderOrderBook();
  renderTrades();
  setupTradeToggle();
  setupChartInteraction();
  updateClock();

  // Live update intervals
  setInterval(simulatePriceUpdate, 1500);
  setInterval(simulateNewTrade, 2200);
  setInterval(simulateOrderBookUpdate, 1800);
  setInterval(simulateCandleUpdate, 1000);
  setInterval(updateClock, 1000);
  setInterval(animatePortfolio, 3000);
}

// Start
document.addEventListener('DOMContentLoaded', init);