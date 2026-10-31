'use client';

import { useState } from 'react';
import BirthForm from '@/components/BirthForm';
import ChartBoard from '@/components/ChartBoard';
import InsightPanel from '@/components/InsightPanel';
import TimeNav, { type TimeView } from '@/components/TimeNav';
import { generateChart } from '@/lib/ziwei/algorithm';
import type { BirthInfo, ZiweiChart, Palace } from '@/lib/ziwei/types';

/**
 * 命盘页 —— 开源版「排盘引擎 Demo」
 *
 * 手机端：
 * 命盘与解读自动改为上下排列，避免命盘被双栏布局挤压。
 *
 * 大屏端：
 * 保持命盘 + 解读双栏布局。
 */
export default function ChartPage() {
  const [chart, setChart] = useState<ZiweiChart | null>(null);
  const [selectedPalace, setSelectedPalace] = useState<Palace | null>(null);
  const [view, setView] = useState<TimeView>('mingpan');
  const [liunianYear, setLiunianYear] = useState(() =>
    new Date().getFullYear()
  );

  // ── 未起盘：展示出生信息表单 ──
  if (!chart) {
    return (
      <main
        style={{
          width: '100%',
          maxWidth: 720,
          margin: '0 auto',
          padding: '32px 16px',
          boxSizing: 'border-box',
        }}
      >
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          紫微斗数排盘
        </h1>

        <p
          style={{
            color: '#888',
            marginBottom: 32,
            fontSize: 14,
            lineHeight: 1.7,
          }}
        >
          输入出生年月日时，开源排盘引擎即时生成命盘。
          <br />
          （本页为引擎 Demo，完整商业版界面不在开源范围；排盘内核完全开放。）
        </p>

        <BirthForm
          onSubmit={(info: BirthInfo) =>
            setChart(generateChart(info))
          }
        />
      </main>
    );
  }

  // ── 已起盘：命盘 + 解读 ──
  return (
    <main
      style={{
        width: '100%',
        maxWidth: 1280,
        margin: '0 auto',
        padding: '16px',
        boxSizing: 'border-box',
        overflowX: 'hidden',
      }}
    >
      <button
        type="button"
        onClick={() => {
          setChart(null);
          setSelectedPalace(null);
        }}
        style={{
          marginBottom: 16,
          padding: '8px 14px',
          cursor: 'pointer',
          border: '1px solid #ccc',
          borderRadius: 8,
          background: 'transparent',
        }}
      >
        ← 重新起盘
      </button>

      <div
        style={{
          width: '100%',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <TimeNav
          chart={chart}
          view={view}
          liunianYear={liunianYear}
          onViewChange={setView}
          onYearChange={setLiunianYear}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(min(100%, 600px), 1fr))',
          gap: 20,
          marginTop: 16,
          alignItems: 'start',
          width: '100%',
        }}
      >
        <div
          style={{
            width: '100%',
            minWidth: 0,
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <ChartBoard
            chart={chart}
            onPalaceSelect={setSelectedPalace}
          />
        </div>

        <div
          style={{
            width: '100%',
            minWidth: 0,
          }}
        >
          <InsightPanel
            chart={chart}
            selectedPalace={selectedPalace}
          />
        </div>
      </div>
    </main>
  );
}