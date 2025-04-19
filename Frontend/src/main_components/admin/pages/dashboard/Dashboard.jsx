import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Paper,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import axiosInstance from '../../../../features/axiosInstance';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    clients: 0,
    agents: 0,
    totalSales: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [clientsRes, agentsRes, paymentsRes] = await Promise.all([
          axiosInstance.get('/clients/'),
          axiosInstance.get('/agents/'),
          axiosInstance.get('/payments/'),
        ]);

        const clientsCount = clientsRes.data.length;
        const agentsCount = agentsRes.data.length;
        const totalSales = paymentsRes.data.reduce(
          (sum, payment) => sum + parseFloat(payment.amount || 0),
          0
        );

        setMetrics({
          clients: clientsCount,
          agents: agentsCount,
          totalSales,
        });
      } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);


  const [openHistory, setOpenHistory] = useState(false);
  const [payments, setPayments] = useState([]);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "client", headerName: "Client", flex: 1 },
    { field: "plot", headerName: "Plot", flex: 1 },
    { field: "amount", headerName: "Amount (₱)", flex: 1 },
    { field: "payment_method", headerName: "Payment Method", flex: 1 },
    { field: "remarks", headerName: "Remarks", flex: 1 },
    { field: "created_by", headerName: "Created By", flex: 1 },
    { field: "created_at", headerName: "Date Paid", flex: 1 },
  ];

  useEffect(() => {
    if (openHistory) {
      axiosInstance.get('/payments/')
        .then(({ data }) => {
          console.log('payments payload:', data);
          setPayments(data);
        })
        .catch(err => console.error(err));
    }
  }, [openHistory]);
  


  // Dummy data (until you hook up plots API too)
  const [plotChartData, setPlotChartData] = useState([]);

  

  useEffect(() => {
    const fetchPlotStats = async () => {
      try {
        const res = await axiosInstance.get('/plots/');
        const plots = res.data;

        // Group by block and status
        const groupedData = {};

        plots.forEach((plot) => {
          const block = plot.block || 'Unknown Block';
          const status = plot.status || 'vacant'; // default fallback

          if (!groupedData[block]) {
            groupedData[block] = { block, sold: 0, reserved: 0, vacant: 0 };
          }

          if (status === 'sold') groupedData[block].sold += 1;
          else if (status === 'reserved') groupedData[block].reserved += 1;
          else groupedData[block].vacant += 1;
        });

        setPlotChartData(Object.values(groupedData));
      } catch (err) {
        console.error('Failed to fetch plot stats:', err);
      }
    };

    fetchPlotStats();
  }, []);

  const [allPlots, setAllPlots] = useState([]);
  const [recentSoldPlots, setRecentSoldPlots] = useState([]);

  useEffect(() => {
    const fetchPlots = async () => {
      try {
        const response = await axiosInstance.get('/plots/');
        setAllPlots(response.data);

        // Filter sold plots and sort by purchase_date descending
        const soldPlots = response.data
          .filter(plot => plot.status.toLowerCase() === 'sold')
          .sort((a, b) => new Date(b.purchase_date) - new Date(a.purchase_date))
          .slice(0, 3); // limit to latest 5

        setRecentSoldPlots(soldPlots);
      } catch (error) {
        console.error('Error fetching plots:', error);
      }
    };

    fetchPlots();
  }, []);


  return (
    <Box sx={{ p: 5, bgcolor: '#001829', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3} mb={4}>
        {[ 
          { label: 'Clients Count', value: metrics.clients },
          { label: 'Agents Count', value: metrics.agents },
          {
            label: 'Total Sales',
            value: `Php ${metrics.totalSales.toLocaleString()}`,
          },
        ].map((item, idx) => (
          <Grid key={idx} item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#002742', boxShadow: 2 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  {item.label}
                </Typography>
                <Typography variant="h4">{loading ? '...' : item.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#002742', boxShadow: 2 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="subtitle1" color="text.secondary">
                Transaction History
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => setOpenHistory(true)}
              >
                History
              </Button>
            </CardContent>
          </Card>

          <Dialog open={openHistory} onClose={() => setOpenHistory(false)} maxWidth="lg" fullWidth>
            <DialogTitle>Transaction History</DialogTitle>
            <DialogContent>
              <div style={{ height: 500, width: '100%', backgroundColor: '#002742' }}>
                <DataGrid
                  rows={payments}            // ← use your payments state
                  columns={columns}
                  getRowId={(row) => row.id} // ← or just remove this line if `row.id` exists
                  disableRowSelectionOnClick
                />
              </div>
            </DialogContent>
          </Dialog>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, backgroundColor: '#002742', boxShadow: 2 }}>
            <Typography variant="h6" gutterBottom>
              Plot Chart Statistics
            </Typography>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={plotChartData}>
                <XAxis dataKey="block" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sold" fill="#1976d2" name="Sold" />
                <Bar dataKey="reserved" fill="#fdd835" name="Reserved" />
                <Bar dataKey="vacant" fill="#9e9e9e" name="Vacant" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, backgroundColor: '#002742', boxShadow: 2 }}>
            <Typography variant="h6" gutterBottom color="white">
              Recently Sold Plots
            </Typography>
            {recentSoldPlots.length > 0 ? (
              recentSoldPlots.map((plot) => (
                <Box
                  key={plot.plot_id}
                  sx={{
                    mb: 2,
                    borderBottom: '1px solid #e0e0e0',
                    pb: 1,
                  }}
                >
                  <Typography variant="body1" color="white">ID: {plot.plot_id}</Typography>
                  <Typography variant="body1" color="white">Name: {plot.plot_name}</Typography>
                  <Typography variant="body1" color="white">Type: {plot.plot_type}</Typography>
                  <Typography variant="body1" color="white">
                    Price: Php {plot.price.toLocaleString()}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography color="white">No sold plots yet.</Typography>
            )}
          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
};

export default Dashboard;
