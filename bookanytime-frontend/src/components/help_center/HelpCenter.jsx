import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Paper,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Logo from "../../../public/lg.png"
const HelpCenter = () => {
  return (
    <div
      className="py-5 px-3"
      style={{
        background: 'linear-gradient(to right, #f8f9fa, #e3f2fd)',
        minHeight: '100vh',
        fontFamily: '"Roboto", sans-serif',
      }}
    >
      <Paper elevation={3} className="container p-4" style={{ borderRadius: '16px' }}>
      <div
  className="text-center mb-4"
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    color: "#1976d2",
    fontWeight: "bold",
  }}
>
  <img
    src={Logo}
    alt="Logo"
    style={{
      width: "35px",
      height: "35px",
      objectFit: "contain",
    }}
  />
  <h2 style={{ margin: 0 }}>HELP CENTER</h2>
</div>


        {/* Account & Profile */}
        <h4 className="mt-5 mb-3" style={{ color: '#0d6efd' }}>Account & Profile</h4>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography><strong>How Do I Create An Account?</strong></Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Click On The <strong>"Signup"</strong> Button In The Header And Fill In Your Details. Once Submitted, Your Account Will Be Created And You Can Start Using <strong>BookAnytime</strong>.
            </Typography>
          </AccordionDetails>
        </Accordion>


        {/* Wishlist & Recently Viewed */}
        <h4 className="mt-5 mb-3" style={{ color: '#0d6efd' }}>Wishlist & Recently Viewed</h4>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography><strong>How Does The Wishlist Work?</strong></Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Click The <span style={{ color: 'red' }}>❤️ Heart Icon</span> On Any Property To Add It To Your Wishlist. You Can Organize And Revisit Wishlists Anytime.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography><strong>Can I Organize My Wishlist?</strong></Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Yes! You Can Create Multiple Wishlists And Move Properties Between Them Via The <strong>Wishlist Page</strong>.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography><strong>What Is "Recently Viewed"?</strong></Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              It Keeps Track Of Properties You’ve Browsed, So You Can Easily Return To Them Later.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Offers & Discounts */}
        <h4 className="mt-5 mb-3" style={{ color: '#0d6efd' }}>Offers & Discounts</h4>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography><strong>How Can I Apply Offers?</strong></Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Offers Are Shown On The Homepage. Click An Offer To See Eligible Properties. Share The Offer Image With The Host On <span style={{ color: 'green', fontWeight: 'bold' }}>WhatsApp</span> During Booking.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography><strong>Are Offers Limited To Certain Properties?</strong></Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Yes, Each Offer Is Valid Only For Selected Properties Or Categories. Full Details Are Listed On The Offer Page.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography><strong>Can I Combine Multiple Offers?</strong></Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              No, Only One Offer Can Be Applied Per Booking Unless Specifically Mentioned Otherwise.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Cancellation & Refunds */}
        <h4 className="mt-5 mb-3" style={{ color: '#0d6efd' }}>Cancellation & Refunds</h4>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography><strong>How Can I Cancel A Booking?</strong></Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Since Bookings Are Handled Via <span style={{ color: 'green', fontWeight: 'bold' }}>WhatsApp</span>, You’ll Need To Contact The Property Owner Directly To Cancel.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography><strong>Do I Get A Refund If I Cancel?</strong></Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Refund Policies Are Managed Individually By Each Property. Please Confirm With The Owner During Booking.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography><strong>What If The Host Cancels My Booking?</strong></Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              In Case Of Cancellation By The Host, You'll Be Notified Via <span style={{ color: 'green', fontWeight: 'bold' }}>WhatsApp</span>. You Can Then Review Alternative Properties.
            </Typography>
          </AccordionDetails>
        </Accordion>


        {/* Contact & Support */}
        <h4 className="mt-5 mb-3" style={{ color: '#0d6efd' }}>Contact & Support</h4>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography><strong>I Need Help Urgently — What Do I Do?</strong></Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              For Urgent Help, Contact The Property Owner Via <span style={{ color: 'green', fontWeight: 'bold' }}>WhatsApp</span>. For Platform Issues, Use The “Feedback” Form Below.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography><strong>How Can I Contact The BookAnytime Team?</strong></Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Email Us At <a href="mailto:support@bookanytime.com" style={{ color: '#1976d2', fontWeight: 'bold' }}>Support@BookAnytime.Com</a> Or Use The Feedback Section. We’ll Respond As Quickly As Possible.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Paper>
    </div>
  );
};

export default HelpCenter;
