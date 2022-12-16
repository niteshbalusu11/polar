import React from 'react';
import { ISelectedOrHovered } from '@mrblenny/react-flow-chart';
import { Status } from 'shared/types';
import { initChartFromNetwork } from 'utils/chart';
import { getNetwork, renderWithProviders } from 'utils/tests';
import Sidebar from './Sidebar';

describe('Sidebar Component', () => {
  const renderComponent = (
    selectedType?: ISelectedOrHovered['type'],
    selectedId?: string,
    status?: Status,
  ) => {
    const network = getNetwork(1, 'test network', status);
    const chart = initChartFromNetwork(network);
    if (selectedType && selectedId) {
      chart.selected = { type: selectedType, id: selectedId };
    }
    const initialState = {
      network: {
        networks: [network],
      },
      designer: {
        activeId: network.id,
        allCharts: {
          [network.id]: chart,
        },
      },
    };

    const result = renderWithProviders(<Sidebar network={network} chart={chart} />, {
      initialState,
    });
    return {
      ...result,
      network,
    };
  };

  it('should render default text when no node is selected', () => {
    const { getByText } = renderComponent();
    expect(getByText('Network Designer')).toBeInTheDocument();
  });

  it('should display bitcoind details', async () => {
    const { findByText } = renderComponent('node', 'backend1');
    expect(await findByText('bitcoin')).toBeInTheDocument();
    expect(await findByText('Bitcoin Core')).toBeInTheDocument();
  });

  it('should display lnd details', async () => {
    const { findByText } = renderComponent('node', 'alice');
    expect(await findByText('lightning')).toBeInTheDocument();
    expect(await findByText('LND')).toBeInTheDocument();
  });

  it('should not display details of a selected invalid node', () => {
    const { getByText } = renderComponent('node', 'invalid-node');
    expect(getByText('Network Designer')).toBeInTheDocument();
  });

  it('should display link details', async () => {
    const { findByText } = renderComponent('link', 'alice-backend1');
    expect(await findByText('Chain Backend Connection')).toBeInTheDocument();
  });
});
