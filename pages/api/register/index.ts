import dbConnect from '../../../libs/dbConnect';
import User, {EmailToken} from '../../../models/user';
import bcryptjs from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from "next";
import {randomUUID} from "node:crypto";
import {sendVerificationEmail} from "../../../utils/sendVerificationEmail";
import rateLimitMiddleware from "../../../limiters/rateLimiter";
import emailRateLimitMiddleware from "../../../limiters/emailRateLimiter";

const universities = {
  "stanford.edu": "Stanford University",
  "mit.edu": "Massachusetts Institute of Technology",
  "harvard.edu": "Harvard University",
  "princeton.edu": "Princeton University",
  "caltech.edu": "California Institute of Technology",
  "berkeley.edu": "University of California, Berkeley",
  "yale.edu": "Yale University",
  "uchicago.edu": "University of Chicago",
  "jhu.edu": "Johns Hopkins University",
  "upenn.edu": "University of Pennsylvania",
  "columbia.edu": "Columbia University",
  "ucla.edu": "University of California, Los Angeles",
  "cornell.edu": "Cornell University",
  "umich.edu": "University of Michigan-Ann Arbor",
  "cmu.edu": "Carnegie Mellon University",
  "washington.edu": "University of Washington",
  "duke.edu": "Duke University",
  "northwestern.edu": "Northwestern University",
  "brown.edu": "Brown University",
  "notredame.edu": "University of Notre Dame",
  "vanderbilt.edu": "Vanderbilt University",
  "dartmouth.edu": "Dartmouth College",
  "rice.edu": "Rice University",
  "emory.edu": "Emory University",
  "unc.edu": "University of North Carolina at Chapel Hill",
  "wustl.edu": "Washington University in St. Louis",
  "georgetown.edu": "Georgetown University",
  "usc.edu": "University of Southern California",
  "universityoftexas.edu": "University of Texas at Austin",
  "uwmad.wisc.edu": "University of Wisconsin-Madison",
  "universityofvirginia.edu": "University of Virginia",
  "nyu.edu": "New York University",
  "tufts.edu": "Tufts University",
  "universityofflorida.edu": "University of Florida",
  "universityofmiami.edu": "University of Miami",
  "bostoncollege.edu": "Boston College",
  "ucdavis.edu": "University of California, Davis",
  "uwashington.edu": "University of Washington",
  "udel.edu": "University of Delaware",
  "gatech.edu": "Georgia Institute of Technology",
  "rpi.edu": "Rensselaer Polytechnic Institute",
  "case.edu": "Case Western Reserve University",
  "ucsd.edu": "University of California, San Diego",
  "ucsb.edu": "University of California, Santa Barbara",
  "umass.edu": "University of Massachusetts Amherst",
  "msu.edu": "Michigan State University",
  "osu.edu": "Ohio State University",
  "purdue.edu": "Purdue University",
  "uiuc.edu": "University of Illinois at Urbana-Champaign",
  "tamu.edu": "Texas A&M University",
  "ufl.edu": "University of Florida",
  "umd.edu": "University of Maryland",
  "clemson.edu": "Clemson University",
  "rutgers.edu": "Rutgers University",
  "psu.edu": "Pennsylvania State University",
  "usf.edu": "University of South Florida",
  "bu.edu": "Boston University",
  "uga.edu": "University of Georgia",
  "indiana.edu": "Indiana University Bloomington",
  "utk.edu": "University of Tennessee",
  "auburn.edu": "Auburn University",
  "okstate.edu": "Oklahoma State University",
  "txstate.edu": "Texas State University",
  "olemiss.edu": "University of Mississippi",
  "wayne.edu": "Wayne State University",
  "northeastern.edu": "Northeastern University",
  "kcl.ac.uk": "King's College London",
  "ox.ac.uk": "University of Oxford",
  "cam.ac.uk": "University of Cambridge",
  "imperial.ac.uk": "Imperial College London",
  "lse.ac.uk": "London School of Economics",
  "ucl.ac.uk": "University College London",
  "ed.ac.uk": "University of Edinburgh",
  "manchester.ac.uk": "University of Manchester",
  "warwick.ac.uk": "University of Warwick",
  "glasgow.ac.uk": "University of Glasgow",
  "bristol.ac.uk": "University of Bristol",
  "durham.ac.uk": "Durham University",
  "sheffield.ac.uk": "University of Sheffield",
  "bham.ac.uk": "University of Birmingham",
  "exeter.ac.uk": "University of Exeter",
  "york.ac.uk": "University of York",
  "nottingham.ac.uk": "University of Nottingham",
  "qub.ac.uk": "Queen's University Belfast",
  "sussex.ac.uk": "University of Sussex",
  "kuleuven.be": "KU Leuven",
  "ethz.ch": "ETH Zurich",
  "epfl.ch": "EPFL",
  "helsinki.fi": "University of Helsinki",
  "tcd.ie": "Trinity College Dublin",
  "ku.dk": "University of Copenhagen",
  "univie.ac.at": "University of Vienna",
  "unil.ch": "University of Lausanne",
  "polimi.it": "Politecnico di Milano",
  "unibo.it": "University of Bologna",
  "sciencespo.fr": "Sciences Po",
  "sorbonne-universite.fr": "Sorbonne University",
  "lu.se": "Lund University",
  "ugent.be": "Ghent University",
  "tu-dresden.de": "TU Dresden",
  "tu-berlin.de": "TU Berlin",
  "tum.de": "Technical University of Munich",
  "kit.edu": "Karlsruhe Institute of Technology",
  "uni-heidelberg.de": "University of Heidelberg",
  "uni-mannheim.de": "University of Mannheim",
  "uni-muenchen.de": "University of Munich",
  "uni-freiburg.de": "University of Freiburg",
  "uni-tuebingen.de": "University of Tuebingen",
  "unige.ch": "University of Geneva",
  "unibas.ch": "University of Basel",
  "tu-delft.nl": "Delft University of Technology",
  "uva.nl": "University of Amsterdam",
  "uu.nl": "Utrecht University",
  "rug.nl": "University of Groningen",
  "ucd.ie": "University College Dublin",
  "nuigalway.ie": "National University of Ireland Galway",
  "usw.edu.au": "University of New South Wales",
  "uq.edu.au": "University of Queensland",
  "unimelb.edu.au": "University of Melbourne",
  "utas.edu.au": "University of Tasmania",
  "anu.edu.au": "Australian National University",
  "adelaide.edu.au": "University of Adelaide",
  "curtin.edu.au": "Curtin University",
  "monash.edu.au": "Monash University",
  "deakin.edu.au": "Deakin University",
  "griffith.edu.au": "Griffith University",
  "latrobe.edu.au": "La Trobe University",
  "unisa.edu.au": "University of South Australia",
  "sydney.edu.au": "University of Sydney",
  "unsw.edu.au": "University of New South Wales",
  "nus.edu.sg": "National University of Singapore",
  "ntu.edu.sg": "Nanyang Technological University",
  "smu.edu.sg": "Singapore Management University",
  "suss.edu.sg": "Singapore University of Social Sciences",
  "sit.edu.sg": "Singapore Institute of Technology",
  "sutd.edu.sg": "Singapore University of Technology and Design",
  "nist.edu.sg": "National Institute of Education",
  "np.edu.sg": "Ngee Ann Polytechnic",
  "sp.edu.sg": "Singapore Polytechnic",
  "rp.edu.sg": "Republic Polytechnic",
  "uni.syndey.edu.au" : "University of Syndey",
  "albany.edu": "University at Albany, SUNY",
  "binghamton.edu": "Binghamton University, SUNY",
  "buffalo.edu": "University at Buffalo, SUNY",
  "stonybrook.edu": "Stony Brook University, SUNY",
  "buffalostate.edu": "SUNY Buffalo State",
  "uci.edu": "University Of California Irvine",
  "ucr.edu": "University Of California Riverside",
  "ucsc.edu": "University Of California Santa Cruz",
  "ucmerced.edu": "University Of California Merced",
  "mail.utoronto.ca": "University of Toronto",
  "student.ubc.ca": "University of British Columbia",
  "mail.mcgill.ca": "McGill University",
  "mail.mcmaster.ca": "McMaster University",
  "ualberta.ca": "University of Alberta",
  "umontreal.ca": "Université de Montréal",
  "uwaterloo.ca": "University of Waterloo",
  "uwo.ca": "Western University",
  "uottawa.ca": "University of Ottawa",
  "sfu.ca": "Simon Fraser University",
  "dal.ca": "Dalhousie University",
  "ulaval.ca": "Université Laval",
  "uvic.ca": "University of Victoria",
  "mail.concordia.ca": "Concordia University",
  "carleton.ca": "Carleton University",
  "vt.edu" : "Virginia Tech",
  "farmingdale.edu" : "SUNY Farmingdale"
}


async function handler(req: NextApiRequest, res: NextApiResponse<any>) {

  function validateEmail(email) {

    const re = /\S+@\S+\.\S+/;
    return (email.toLowerCase().split('@')[1] in universities&&re.test(email)&&email.replace(/[^@]/g, "").length===1)
  }

  const { method } = req;

  try {
    await dbConnect();
    switch (method) {
      case "POST":
        let { email, password, university} = req.body;
        email=email.replace(/\s/g, '');
        if (!email || !password) {
          return res.status(401).json({ error: "Email, and Password are required" });
        }
        if (email.length>30||email.length<4) {
          return res.status(401).json({ error: "email must be 4-30 characters long" });
        }
        if (password.length>100||password.length<4) {
          return res.status(401).json({ error: "Password must be 4-100 characters long" });
        }
        if(!validateEmail(email)) {
          return res.status(401).json({ error: "Not a valid email" });
        }

        const user = await User.findOne({ email });
        if (user&&user.verified) {
                  
          return res.status(400).json({ error: "Verified user already exists" });
        }

        const createdAt=Date.now()
        const emailToken = new EmailToken({
          token:`${randomUUID()}${randomUUID()}`.replace(/-/g, ""),
          createdAt: createdAt,
          expiredAt: createdAt+24*60*60*1000
        })
        if(!emailToken.token) {
          return res.status(500);
        }

        //Finding/Making user and sending email
        try {
          if (user) {
            await User.findOneAndUpdate({email: email}, {emailToken})
            await sendVerificationEmail(email, `${req.headers.host}/activate/${emailToken.token}`);
          } else {
            const salt = await bcryptjs.genSalt(12);
            const hashedPassword = await bcryptjs.hash(password, salt);

            university = universities[email.toLowerCase().split('@')[1]];
            const newUser = new User({
              email,
              password: hashedPassword,
              university: university,
              emailToken: emailToken
            });
            await sendVerificationEmail(email, `${req.headers.host}/activate/${emailToken.token}`);
            await newUser.save();
          }
        } catch (error){
          return res.status(500).json({ message: `Error: ${error}` });
        }

        return res.status(200).json({ message: "User saved successfully" });

      default:
        return res.status(400).json("No method for this endpoint");
    }
  } catch (error) {
      console.log(error)
      return res.status(500).json({ error: "Something went wrong" });
  }
  return res.status(500).json({ error: "Something went wrong" });
}

export default emailRateLimitMiddleware(handler);