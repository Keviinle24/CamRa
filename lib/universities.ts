// The single source of truth for supported schools. Registration requires an
// email on one of these domains (or a subdomain, e.g. g.ucla.edu), and the
// aliases let the chat filter recognise a school when it's typed as an interest.

export type University = {
  name: string;
  domains: string[];
  aliases: string[];
};

const u = (name: string, domains: string[], aliases: string[] = []): University => ({ name, domains, aliases });

export const UNIVERSITIES: University[] = [
  // United States
  u('Stanford University', ['stanford.edu'], ['stanford']),
  u('Massachusetts Institute of Technology', ['mit.edu'], ['mit']),
  u('Harvard University', ['harvard.edu'], ['harvard']),
  u('Princeton University', ['princeton.edu'], ['princeton']),
  u('California Institute of Technology', ['caltech.edu'], ['caltech']),
  u('University of California, Berkeley', ['berkeley.edu'], ['berkeley', 'uc berkeley', 'ucb']),
  u('Yale University', ['yale.edu'], ['yale']),
  u('University of Chicago', ['uchicago.edu'], ['uchicago']),
  u('Johns Hopkins University', ['jhu.edu'], ['jhu', 'johns hopkins']),
  u('University of Pennsylvania', ['upenn.edu'], ['upenn', 'penn']),
  u('Columbia University', ['columbia.edu'], ['columbia']),
  u('University of California, Los Angeles', ['ucla.edu'], ['ucla', 'university of california los angeles']),
  u('Cornell University', ['cornell.edu'], ['cornell']),
  u('University of Michigan-Ann Arbor', ['umich.edu'], ['umich']),
  u('Carnegie Mellon University', ['cmu.edu'], ['cmu']),
  u('University of Washington', ['uw.edu', 'washington.edu', 'uwashington.edu'], ['uw', 'washington']),
  u('Duke University', ['duke.edu'], ['duke']),
  u('Northwestern University', ['northwestern.edu'], ['northwestern']),
  u('Brown University', ['brown.edu'], ['brown']),
  u('University of Notre Dame', ['nd.edu', 'notredame.edu'], ['notre dame', 'notredame']),
  u('Vanderbilt University', ['vanderbilt.edu'], ['vanderbilt']),
  u('Dartmouth College', ['dartmouth.edu'], ['dartmouth']),
  u('Rice University', ['rice.edu'], ['rice']),
  u('Emory University', ['emory.edu'], ['emory']),
  u('University of North Carolina at Chapel Hill', ['unc.edu'], ['unc']),
  u('Washington University in St. Louis', ['wustl.edu'], ['wustl']),
  u('Georgetown University', ['georgetown.edu'], ['georgetown']),
  u('University of Southern California', ['usc.edu'], ['usc']),
  u('University of Texas at Austin', ['utexas.edu', 'universityoftexas.edu'], ['ut', 'ut austin']),
  u('University of Wisconsin-Madison', ['wisc.edu', 'uwmad.wisc.edu'], ['uwmad', 'uw madison']),
  u('University of Virginia', ['virginia.edu', 'universityofvirginia.edu'], ['uva']),
  u('New York University', ['nyu.edu'], ['nyu']),
  u('Tufts University', ['tufts.edu'], ['tufts']),
  u('University of Florida', ['ufl.edu', 'universityofflorida.edu'], ['uf']),
  u('University of Miami', ['miami.edu', 'universityofmiami.edu'], ['miami']),
  u('Boston College', ['bc.edu', 'bostoncollege.edu'], ['bc', 'bostoncollege']),
  u('University of California, Davis', ['ucdavis.edu'], ['ucdavis']),
  u('University of Delaware', ['udel.edu'], ['udel']),
  u('Georgia Institute of Technology', ['gatech.edu'], ['gatech', 'georgia tech']),
  u('Rensselaer Polytechnic Institute', ['rpi.edu'], ['rpi']),
  u('Case Western Reserve University', ['case.edu'], ['case', 'case western']),
  u('University of California, San Diego', ['ucsd.edu'], ['ucsd']),
  u('University of California, Santa Barbara', ['ucsb.edu'], ['ucsb']),
  u('University of Massachusetts Amherst', ['umass.edu'], ['umass']),
  u('Michigan State University', ['msu.edu'], ['msu']),
  u('Ohio State University', ['osu.edu'], ['osu']),
  u('Purdue University', ['purdue.edu'], ['purdue']),
  u('University of Illinois at Urbana-Champaign', ['illinois.edu', 'uiuc.edu'], ['uiuc']),
  u('Texas A&M University', ['tamu.edu'], ['tamu']),
  u('University of Maryland', ['umd.edu'], ['umd']),
  u('Clemson University', ['clemson.edu'], ['clemson']),
  u('Rutgers University', ['rutgers.edu'], ['rutgers']),
  u('Pennsylvania State University', ['psu.edu'], ['psu', 'penn state']),
  u('University of South Florida', ['usf.edu'], ['usf']),
  u('Boston University', ['bu.edu'], ['bu']),
  u('University of Georgia', ['uga.edu'], ['uga']),
  u('Indiana University Bloomington', ['indiana.edu'], ['indiana']),
  u('University of Tennessee', ['utk.edu'], ['utk']),
  u('Auburn University', ['auburn.edu'], ['auburn']),
  u('Oklahoma State University', ['okstate.edu'], ['okstate']),
  u('Texas State University', ['txstate.edu'], ['txstate']),
  u('University of Mississippi', ['olemiss.edu'], ['olemiss']),
  u('Wayne State University', ['wayne.edu'], ['wayne']),
  u('Northeastern University', ['northeastern.edu', 'neu.edu'], ['northeastern', 'neu', 'nu']),
  u('Virginia Tech', ['vt.edu'], ['vt']),
  u('University at Albany, SUNY', ['albany.edu'], ['albany']),
  u('Binghamton University, SUNY', ['binghamton.edu'], ['binghamton']),
  u('University at Buffalo, SUNY', ['buffalo.edu'], ['buffalo', 'ub']),
  u('Stony Brook University, SUNY', ['stonybrook.edu'], ['stonybrook']),
  u('SUNY Buffalo State', ['buffalostate.edu'], ['buffalostate']),
  u('SUNY Farmingdale', ['farmingdale.edu'], ['farmingdale']),
  u('University of California, Irvine', ['uci.edu'], ['uci']),
  u('University of California, Riverside', ['ucr.edu'], ['ucr']),
  u('University of California, Santa Cruz', ['ucsc.edu'], ['ucsc']),
  u('University of California, Merced', ['ucmerced.edu'], ['ucmerced']),

  // United Kingdom & Ireland
  u("King's College London", ['kcl.ac.uk'], ['kcl']),
  u('University of Oxford', ['ox.ac.uk'], ['oxford']),
  u('University of Cambridge', ['cam.ac.uk'], ['cambridge']),
  u('Imperial College London', ['imperial.ac.uk'], ['imperial']),
  u('London School of Economics', ['lse.ac.uk'], ['lse']),
  u('University College London', ['ucl.ac.uk'], ['ucl']),
  u('University of Edinburgh', ['ed.ac.uk'], ['edinburgh']),
  u('University of Manchester', ['manchester.ac.uk'], ['manchester']),
  u('University of Warwick', ['warwick.ac.uk'], ['warwick']),
  u('University of Glasgow', ['glasgow.ac.uk'], ['glasgow']),
  u('University of Bristol', ['bristol.ac.uk'], ['bristol']),
  u('Durham University', ['durham.ac.uk'], ['durham']),
  u('University of Sheffield', ['sheffield.ac.uk'], ['sheffield']),
  u('University of Birmingham', ['bham.ac.uk'], ['birmingham']),
  u('University of Exeter', ['exeter.ac.uk'], ['exeter']),
  u('University of York', ['york.ac.uk'], ['york']),
  u('University of Nottingham', ['nottingham.ac.uk'], ['nottingham']),
  u("Queen's University Belfast", ['qub.ac.uk'], ['qub']),
  u('University of Sussex', ['sussex.ac.uk'], ['sussex']),
  u('Trinity College Dublin', ['tcd.ie'], ['tcd']),
  u('University College Dublin', ['ucd.ie'], ['ucd']),
  u('National University of Ireland Galway', ['nuigalway.ie'], ['nuigalway']),

  // Europe
  u('KU Leuven', ['kuleuven.be'], ['kuleuven']),
  u('ETH Zurich', ['ethz.ch'], ['ethz']),
  u('EPFL', ['epfl.ch'], ['epfl']),
  u('University of Helsinki', ['helsinki.fi'], ['helsinki']),
  u('University of Copenhagen', ['ku.dk'], ['copenhagen']),
  u('University of Vienna', ['univie.ac.at'], ['vienna']),
  u('University of Lausanne', ['unil.ch'], ['lausanne']),
  u('Politecnico di Milano', ['polimi.it'], ['polimi']),
  u('University of Bologna', ['unibo.it'], ['unibo']),
  u('Sciences Po', ['sciencespo.fr'], ['sciencespo']),
  u('Sorbonne University', ['sorbonne-universite.fr'], ['sorbonne']),
  u('Lund University', ['lu.se'], ['lund']),
  u('Ghent University', ['ugent.be'], ['ugent']),
  u('TU Dresden', ['tu-dresden.de'], ['tudresden']),
  u('TU Berlin', ['tu-berlin.de'], ['tuberlin']),
  u('Technical University of Munich', ['tum.de'], ['tum']),
  u('Karlsruhe Institute of Technology', ['kit.edu'], ['kit']),
  u('University of Heidelberg', ['uni-heidelberg.de'], ['heidelberg']),
  u('University of Mannheim', ['uni-mannheim.de'], ['mannheim']),
  u('University of Munich', ['uni-muenchen.de'], ['munich', 'lmu']),
  u('University of Freiburg', ['uni-freiburg.de'], ['freiburg']),
  u('University of Tuebingen', ['uni-tuebingen.de'], ['tuebingen']),
  u('University of Geneva', ['unige.ch'], ['geneva']),
  u('University of Basel', ['unibas.ch'], ['basel']),
  u('Delft University of Technology', ['tu-delft.nl'], ['delft']),
  u('University of Amsterdam', ['uva.nl'], ['amsterdam']),
  u('Utrecht University', ['uu.nl'], ['utrecht']),
  u('University of Groningen', ['rug.nl'], ['groningen']),

  // Australia
  u('University of New South Wales', ['unsw.edu.au', 'usw.edu.au'], ['unsw']),
  u('University of Queensland', ['uq.edu.au'], ['uq']),
  u('University of Melbourne', ['unimelb.edu.au'], ['unimelb']),
  u('University of Tasmania', ['utas.edu.au'], ['utas']),
  u('Australian National University', ['anu.edu.au'], ['anu']),
  u('University of Adelaide', ['adelaide.edu.au'], ['adelaide']),
  u('Curtin University', ['curtin.edu.au'], ['curtin']),
  u('Monash University', ['monash.edu.au'], ['monash']),
  u('Deakin University', ['deakin.edu.au'], ['deakin']),
  u('Griffith University', ['griffith.edu.au'], ['griffith']),
  u('La Trobe University', ['latrobe.edu.au'], ['latrobe']),
  u('University of South Australia', ['unisa.edu.au'], ['unisa']),
  u('University of Sydney', ['sydney.edu.au'], ['sydney']),

  // Singapore
  u('National University of Singapore', ['nus.edu.sg'], ['nus']),
  u('Nanyang Technological University', ['ntu.edu.sg'], ['ntu']),
  u('Singapore Management University', ['smu.edu.sg'], ['smu']),
  u('Singapore University of Social Sciences', ['suss.edu.sg'], ['suss']),
  u('Singapore Institute of Technology', ['sit.edu.sg'], ['sit']),
  u('Singapore University of Technology and Design', ['sutd.edu.sg'], ['sutd']),
  u('National Institute of Education', ['nie.edu.sg', 'nist.edu.sg'], ['nie']),
  u('Ngee Ann Polytechnic', ['np.edu.sg'], ['np']),
  u('Singapore Polytechnic', ['sp.edu.sg'], ['sp']),
  u('Republic Polytechnic', ['rp.edu.sg'], ['rp']),

  // Canada
  u('University of Toronto', ['mail.utoronto.ca'], ['toronto', 'uoft']),
  u('University of British Columbia', ['student.ubc.ca'], ['ubc']),
  u('McGill University', ['mail.mcgill.ca'], ['mcgill']),
  u('McMaster University', ['mail.mcmaster.ca'], ['mcmaster']),
  u('University of Alberta', ['ualberta.ca'], ['ualberta']),
  u('Université de Montréal', ['umontreal.ca'], ['umontreal']),
  u('University of Waterloo', ['uwaterloo.ca'], ['waterloo']),
  u('Western University', ['uwo.ca'], ['western']),
  u('University of Ottawa', ['uottawa.ca'], ['ottawa']),
  u('Simon Fraser University', ['sfu.ca'], ['sfu']),
  u('Dalhousie University', ['dal.ca'], ['dal']),
  u('Université Laval', ['ulaval.ca'], ['ulaval']),
  u('University of Victoria', ['uvic.ca'], ['uvic']),
  u('Concordia University', ['mail.concordia.ca'], ['concordia']),
  u('Carleton University', ['carleton.ca'], ['carleton']),
];

const byDomain = new Map(UNIVERSITIES.flatMap((uni) => uni.domains.map((domain) => [domain, uni] as const)));

/** Finds the school for an email address, accepting subdomains such as g.ucla.edu. */
export function universityForEmail(email: string): University | undefined {
  const at = email.lastIndexOf('@');
  if (at < 0) return undefined;
  const labels = email.slice(at + 1).trim().toLowerCase().split('.');
  for (let i = 0; i < labels.length - 1; i++) {
    const match = byDomain.get(labels.slice(i).join('.'));
    if (match) return match;
  }
  return undefined;
}

const universityTags = new Set(
  UNIVERSITIES.flatMap((uni) => [uni.name, ...uni.domains, ...uni.aliases].map((tag) => tag.toLowerCase())),
);

export function isUniversityTag(tag: string) {
  return universityTags.has(tag.trim().toLowerCase());
}
