import { ThreeDLine } from '../ThreeDLine';


describe('bin doing bin things', () => {
  test('creating bins', () => {

    const {createBin, getBins} = ThreeDLine({});

    expect(createBin).toBeDefined();
    expect(getBins).toBeDefined();

    const bins = getBins();
    expect(bins).toHaveProperty('active', 0);
    expect(bins).toHaveProperty('bins', []);

    createBin();

    const newBins = getBins();

    expect(newBins).toHaveProperty('active', 1);
    expect(newBins).toHaveProperty('bins', [
      {color: '#00ff00', colorGradient: null, id: 1, points: []}
    ]);

    const cg = {from: '#000000', to: '#ffffff'};
    createBin({colorGradient: cg, color: '#ff00ff'})

    const twoBins = getBins();
    expect(twoBins).toHaveProperty('active', 2);
    expect(twoBins).toHaveProperty('bins', [
      {color: '#00ff00', colorGradient: null, id: 1, points: []},
      {color: '#ff00ff', colorGradient: cg, id: 2, points: []}
    ]);

  });
});
