import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

function mockPrice(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash + id.charCodeAt(i) * (i + 1)) % 10000;
  }
  return 3980 + (hash % 38) * 1000;
}

function mockPoints(price: number): number {
  return Math.floor(price * 0.01);
}

function formatYen(amount: number): string {
  return `¥${amount.toLocaleString('ja-JP')}`;
}

const SHOP_NAMES = [
  'STYLE MART',
  'URBAN CLOSET',
  'MENS EDIT',
  'CLASSIC HOUSE',
  'DAILY WEAR CO.',
];

function shopName(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash += id.charCodeAt(i);
  return SHOP_NAMES[hash % SHOP_NAMES.length];
}

export function HomeGallery() {
  const [looks, setLooks] = useState<Look[]>([]);
  const [filter, setFilter] = useState<StyleTag | 'all'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchLooks().then((data) => {
      if (!cancelled) {
        setLooks(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return looks;
    return looks.filter((l) => l.tag === filter);
  }, [looks, filter]);

  const featured = useMemo(() => looks.slice(0, 4), [looks]);

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">読み込み中…</p>
      </div>
    );
  }

  return (
    <div className="home">
      <section className="campaign-banner" aria-label="Campaign">
        <div className="campaign-banner-inner">
          <span className="campaign-badge">SUPER SALE</span>
          <h1 className="campaign-title">
            メンズルックブック — 最大<span className="campaign-highlight">50%OFF</span>
          </h1>
          <p className="campaign-sub">
            ポイント最大10倍 · 送料無料 · 期間限定キャンペーン実施中
          </p>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="home-section home-section--gray" aria-label="Featured picks">
          <div className="section-head">
            <h2 className="section-title">本日のおすすめ</h2>
            <a href="#all" className="section-more">
              もっと見る ›
            </a>
          </div>
          <div className="featured-row">
            {featured.map((look) => {
              const price = mockPrice(look.id);
              return (
                <Link key={look.id} to={`/look/${look.id}`} className="featured-card">
                  <div className="featured-card-img-wrap">
                    <img src={look.hero} alt="" className="featured-card-img" loading="eager" />
                    {look.tag === 'streetwear' && (
                      <span className="product-badge product-badge--sale">SALE</span>
                    )}
                  </div>
                  <div className="featured-card-body">
                    <p className="product-shop">{shopName(look.id)}</p>
                    <h3 className="product-title">{look.title}</h3>
                    <p className="product-price">{formatYen(price)}</p>
                    <p className="product-points">
                      <span className="points-label">ポイント</span>
                      {mockPoints(price).toLocaleString('ja-JP')}pt
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="home-section" id="all" aria-label="Style categories">
        <div className="section-head">
          <h2 className="section-title">カテゴリから探す</h2>
        </div>
        <div className="category-tabs" role="tablist" aria-label="Style filters">
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'all'}
            className={filter === 'all' ? 'category-tab active' : 'category-tab'}
            onClick={() => setFilter('all')}
          >
            すべて
          </button>
          {STYLE_ORDER.map((tag) => (
            <button
              key={tag}
              type="button"
              role="tab"
              aria-selected={filter === tag}
              className={filter === tag ? 'category-tab active' : 'category-tab'}
              onClick={() => setFilter(tag)}
            >
              {STYLE_LABELS[tag]}
            </button>
          ))}
        </div>
      </section>

      <section className="home-section home-section--gray" aria-label="Product listing">
        <div className="section-head">
          <h2 className="section-title">
            {filter === 'all' ? '人気のルック' : STYLE_LABELS[filter]}
          </h2>
          <span className="section-count">{filtered.length}件</span>
        </div>

        {filtered.length === 0 ? (
          <p className="empty-state">該当する商品がありません。</p>
        ) : (
          <div className="product-grid">
            {filtered.map((look, i) => {
              const price = mockPrice(look.id);
              const originalPrice = Math.round(price * 1.3);
              const onSale = i % 3 === 0;
              return (
                <Link key={look.id} to={`/look/${look.id}`} className="product-card">
                  <div className="product-card-img-wrap">
                    <img
                      key={`${look.id}-${look.hero}`}
                      src={look.hero}
                      alt=""
                      className="product-card-img"
                      loading={i < 8 ? 'eager' : 'lazy'}
                    />
                    {onSale && <span className="product-badge product-badge--sale">SALE</span>}
                    {i % 5 === 0 && (
                      <span className="product-badge product-badge--ship">送料無料</span>
                    )}
                  </div>
                  <div className="product-card-body">
                    <p className="product-shop">{shopName(look.id)}</p>
                    <h3 className="product-title">{look.title}</h3>
                    <p className="product-tag">{STYLE_LABELS[look.tag]}</p>
                    <div className="product-price-row">
                      {onSale && (
                        <span className="product-price-original">
                          {formatYen(originalPrice)}
                        </span>
                      )}
                      <span className="product-price">{formatYen(price)}</span>
                    </div>
                    <p className="product-points">
                      <span className="points-label">ポイント</span>
                      {mockPoints(price).toLocaleString('ja-JP')}pt
                    </p>
                    <p className="product-review">
                      ★★★★☆ <span className="review-count">({(i * 7 + 12) % 200 + 5})</span>
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="promo-strip" aria-label="Promotions">
        <div className="promo-strip-item promo-strip-item--points">
          <strong>ポイント10倍</strong>
          <span>対象ショップでお買い物</span>
        </div>
        <div className="promo-strip-item promo-strip-item--coupon">
          <strong>クーポン配布中</strong>
          <span>¥500 OFF クーポンをゲット</span>
        </div>
        <div className="promo-strip-item promo-strip-item--ranking">
          <strong>週間ランキング</strong>
          <span>今売れているメンズルック</span>
        </div>
      </section>
    </div>
  );
}
