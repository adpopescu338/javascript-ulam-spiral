import { useState } from 'react';
import { SketchPicker } from 'react-color';
import type { FormState } from './types';
import { Menu } from '@szhsin/react-menu';

const WithSketchPicker: React.FC<{
  color: string;
  onChangeComplete: (hex: string) => void;
}> = ({ color, onChangeComplete }) => {
  return (
    <Menu menuButton={<span className="with-sketch-picker-menu-button" />}>
      <SketchPicker
        color={color}
        onChangeComplete={(color) => onChangeComplete(color.hex)}
      />
    </Menu>
  );
};

export const Form: React.FC<{
  initialState: FormState;
  onSubmit: (state: FormState) => void;
}> = ({ initialState, onSubmit }) => {
  const [pendingFormState, setPendingFormState] =
    useState<FormState>(initialState);

  const setProperty = <K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) => {
    setPendingFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const updatedFormState = {
          ...pendingFormState,
          // filter duplicates and ensure valid values
          multiples: pendingFormState.multiples.filter((m, i) => {
            if (m.n <= 0 || !m.colorHex) return false;
            return (
              pendingFormState.multiples.findIndex(
                (m2) => m2.n === m.n && m2.colorHex === m.colorHex
              ) === i
            );
          }),
          colorNumbersWhereModNEquals:
            pendingFormState.colorNumbersWhereModNEquals.filter((c, i) => {
              if (c.n <= 0 || c.remainder < 0 || !c.colorHex) return false;
              return (
                pendingFormState.colorNumbersWhereModNEquals.findIndex(
                  (c2) =>
                    c2.n === c.n &&
                    c2.remainder === c.remainder &&
                    c2.colorHex === c.colorHex
                ) === i
              );
            }),
        };

        setPendingFormState(updatedFormState);

        onSubmit(updatedFormState);
      }}
    >
      <div id="form-content">
        {/* Multiples */}
        <div>
          {pendingFormState.multiples.map((m, i) => {
            return (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginBottom: '0.5rem',
                  border: '1px solid #ccc',
                  padding: '0.5rem',
                  borderRadius: '4px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.25rem',
                  }}
                >
                  <label
                    key={i}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      fontSize: '0.9rem',
                    }}
                  >
                    Multiple of
                    <input
                      type="number"
                      min="1"
                      value={m.n}
                      onChange={(e) =>
                        setProperty('multiples', [
                          ...pendingFormState.multiples.slice(0, i),
                          { ...m, n: Number(e.target.value) || 1 },
                          ...pendingFormState.multiples.slice(i + 1),
                        ])
                      }
                    />
                  </label>
                  <WithSketchPicker
                    color={m.colorHex}
                    onChangeComplete={(colorHex) =>
                      setProperty('multiples', [
                        ...pendingFormState.multiples.slice(0, i),
                        { ...m, colorHex },
                        ...pendingFormState.multiples.slice(i + 1),
                      ])
                    }
                  />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setProperty(
                      'multiples',
                      pendingFormState.multiples.filter((_, idx) => idx !== i)
                    )
                  }
                  className="form-button-with-padding form-button-with-mt"
                >
                  Remove
                </button>
              </div>
            );
          })}
          <button
            type="button"
            onClick={() =>
              setProperty('multiples', [
                ...pendingFormState.multiples,
                { n: 2, colorHex: '#00f' },
              ])
            }
            className="form-button-with-padding"
          >
            Add multiple
          </button>
        </div>

        {/* // Generic settings */}
        <div>
          <label
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: '0.9rem',
            }}
          >
            Max number
            <input
              type="number"
              min="1"
              value={pendingFormState.maxVal}
              onChange={(e) =>
                setProperty('maxVal', Number(e.target.value) || 1)
              }
              style={{ width: '90px', marginTop: '0.25rem' }}
            />
          </label>
          <label
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              fontSize: '15px',
            }}
          >
            Display numbers
            <input
              type="checkbox"
              checked={pendingFormState.displayNumbers}
              onChange={(e) => setProperty('displayNumbers', e.target.checked)}
              style={{ marginTop: '0.25rem' }}
            />
          </label>
          <label
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              fontSize: '15px',
            }}
          >
            Display borders
            <input
              type="checkbox"
              checked={pendingFormState.displayBorder}
              onChange={(e) => setProperty('displayBorder', e.target.checked)}
              style={{ marginTop: '0.25rem' }}
            />
          </label>
          <label
            style={{
              display: 'flex',
              fontSize: '15px',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            Color perfect squares
            <input
              type="checkbox"
              checked={pendingFormState.colorPerfectSquares}
              onChange={(e) =>
                setProperty('colorPerfectSquares', e.target.checked)
              }
              style={{ marginTop: '0.25rem' }}
            />
          </label>

          {pendingFormState.colorPerfectSquares && (
            <label
              style={{
                display: 'flex',
                flexDirection: 'column',
                fontSize: '0.9rem',
              }}
            >
              Perfect square color
              <WithSketchPicker
                color={pendingFormState.perfectSquareColorHex}
                onChangeComplete={(colorHex) =>
                  setProperty('perfectSquareColorHex', colorHex)
                }
              />
            </label>
          )}

          <label
            style={{
              display: 'flex',
              fontSize: '15px',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            Primes color
            <WithSketchPicker
              color={pendingFormState.primesColorHex}
              onChangeComplete={(colorHex) =>
                setProperty('primesColorHex', colorHex)
              }
            />
          </label>
        </div>

        {/* Colors mod N equals */}
        <div>
          {pendingFormState.colorNumbersWhereModNEquals.map((c, i) => {
            return (
              <div className="color-mod-n-equals-item">
                <div className="color-mod-n-equals-item-content">
                  <div className="color-mod-n-equals-item-content2">
                    <label
                      key={i}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        fontSize: '0.9rem',
                      }}
                    >
                      Remainder
                      <input
                        type="number"
                        min="1"
                        value={c.remainder}
                        onChange={(e) =>
                          setProperty('colorNumbersWhereModNEquals', [
                            ...pendingFormState.colorNumbersWhereModNEquals.slice(
                              0,
                              i
                            ),
                            { ...c, remainder: Number(e.target.value) || 0 },
                            ...pendingFormState.colorNumbersWhereModNEquals.slice(
                              i + 1
                            ),
                          ])
                        }
                      />
                    </label>

                    <label
                      key={i}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        fontSize: '0.9rem',
                      }}
                    >
                      N
                      <input
                        type="number"
                        min="1"
                        value={c.n}
                        onChange={(e) =>
                          setProperty('colorNumbersWhereModNEquals', [
                            ...pendingFormState.colorNumbersWhereModNEquals.slice(
                              0,
                              i
                            ),
                            { ...c, n: Number(e.target.value) || 0 },
                            ...pendingFormState.colorNumbersWhereModNEquals.slice(
                              i + 1
                            ),
                          ])
                        }
                      />
                    </label>
                  </div>

                  <WithSketchPicker
                    color={c.colorHex}
                    onChangeComplete={(colorHex) =>
                      setProperty('colorNumbersWhereModNEquals', [
                        ...pendingFormState.colorNumbersWhereModNEquals.slice(
                          0,
                          i
                        ),
                        { ...c, colorHex },
                        ...pendingFormState.colorNumbersWhereModNEquals.slice(
                          i + 1
                        ),
                      ])
                    }
                  />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setProperty(
                      'colorNumbersWhereModNEquals',
                      pendingFormState.colorNumbersWhereModNEquals.filter(
                        (_, idx) => idx !== i
                      )
                    )
                  }
                  className="form-button-with-padding form-button-with-mt"
                >
                  Remove
                </button>
              </div>
            );
          })}
          <button
            type="button"
            onClick={() =>
              setProperty('colorNumbersWhereModNEquals', [
                ...pendingFormState.colorNumbersWhereModNEquals,
                { n: 2, remainder: 0, colorHex: '#f00' },
              ])
            }
            className="form-button-with-padding"
          >
            Add color mod N equals
          </button>
        </div>
      </div>

      <button type="submit">Confirm</button>
    </form>
  );
};
