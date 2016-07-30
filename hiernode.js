//=====================================================================
//=====================================================================
//          ___  __        __   __   ___       __  
//  |__| | |__  |__) |\ | /  \ |  \ |__     | /__` 
//  |  | | |___ |  \ | \| \__/ |__/ |___ \__/ .__/ 
//                                                 
//=====================================================================
//=====================================================================
//	Version: v0.1.11
//=====================================================================

/**
 * HierNodeLib Module
 * @module HierNodeLib
 */
var HierNodeLib = (function()
{


	//=====================================================================
	//=====================================================================
	//   __        __   ___          __   __   ___ 
	//  |__)  /\  /__` |__     |\ | /  \ |  \ |__  
	//  |__) /~~\ .__/ |___    | \| \__/ |__/ |___ 
	//                                             
	//=====================================================================
	//=====================================================================


	//==========================================
	/**
	 * @function InitNode
	 * Initializes an object with HierNode specific properties.
	 * @param {object} ThisNode - The object to be node-ified.
	 * @returns {!object} The node-ified node (i.e. ThisNode).
	 */
	function InitNode(ThisNode, ThisPrevNode = null, ThisNextNode = null, ThisIndent = 0)
	{
		ThisNode._hnPrevNode = ThisPrevNode;
		ThisNode._hnNextNode = ThisNextNode;
		ThisNode._hnIndent = ThisIndent;
		return ThisNode;
	}


	//==========================================
	/**
	 * @function PrevNode
	 * @param {object} ThisNode - The node to query.
	 * @returns {?object} The previous node of the given node.
	 */
	function PrevNode(ThisNode)
	{
		return ThisNode._hnPrevNode;
	}


	//==========================================
	/**
	 * @function NextNode
	 * @param {object} ThisNode - The node to query.
	 * @returns {?object} The next node of the given node.
	 */
	function NextNode(ThisNode)
	{
		return ThisNode._hnNextNode;
	}


	//==========================================
	/**
	 * @function Indent
	 * @param {object} ThisNode - The node to query.
	 * @returns {Integer} The indent level of the given node.
	 */
	function Indent(ThisNode)
	{
		return ThisNode._hnIndent;
	}


	//=====================================================================
	//=====================================================================
	//                    __       ___    __       
	//  |\ |  /\  \  / | / _`  /\   |  | /  \ |\ | 
	//  | \| /~~\  \/  | \__> /~~\  |  | \__/ | \| 
	//                                             
	//=====================================================================
	//=====================================================================


	// D3 = C2.Prev        A1
	// C3 = C2.Next         +- B1
	// A1 = C1.First        |   +- C1
	// C7 = C1.Last         |   |   +- D1
	// A1 = C1.Root         |   |   +- D2
	// B1 = C1.Parent       |   |   +- D3
	// C1 = C2.PrevSib      |   +- C2
	// C2 = C1.NextSib      |   +- C3
	// C1 = C1.FirstSib     +- B2
	// C3 = C1.LastSib      |   +- C4
	// B1 = A1.FirstChild   |   +- C5
	// B3 = A1.LastChild    |   +- C6
	// B1 = A1.FirstDesc    +- B3
	// C7 = A1.LastDesc         +- C7


	//==========================================
	/** @class RelationshipTypes
	 * Constants used to direct the processing of the FindRelative function.
	 */
	var RelationshipTypes = {
		
		/** @constant RelationshipTypes\PrevNode
		 * Finds the immediately previous node.
		 */
		PrevNode: 'PrevNode',
		
		/** @constant RelationshipTypes\NextNode
		 * Finds the immediately next node.
		 */
		NextNode: 'NextNode',
		
		FirstNode: 'FirstNode',
		LastNode: 'LastNode',
		RootNode: 'RootNode',
		ParentNode: 'ParentNode',
		PrevSibNode: 'PrevSibNode',
		NextSibNode: 'NextSibNode',
		FirstSibNode: 'FirstSibNode',
		LastSibNode: 'LastSibNode',
		FirstChildNode: 'FirstChildNode',
		LastChildNode: 'LastChildNode',
		FirstDescNode: 'FirstDescNode',
		LastDescNode: 'LastDescNode'
	};


	//==========================================
	/** @function FindRelative
	 * Finds a single other node within the hierarchy of a specific relation
	 * to the given node.
	 * @param {object} ThisNode - The node to query.
	 * @param {RelationshipTypes} RelationshipType - The node to query.
	 * @returns {?object} The found node, or null if non-existent.
	 */
	//==========================================
	
	function FindRelative(ThisNode, RelationshipType)
	{
		var node_prev = ThisNode._hnPrevNode;
		var node_next = ThisNode._hnNextNode;
		var node_root = ThisNode;
		var node_sib = ThisNode;
		var node_child = null;
		while (true)
		{
			if (RelationshipType === RelationshipTypes.PrevNode)
			{
				return ThisNode._hnPrevNode;
			}
			else if (RelationshipType === RelationshipTypes.NextNode)
			{
				return ThisNode._hnNextNode;
			}
			else if (RelationshipType === RelationshipTypes.FirstNode)
			{
				if (node_prev === null)
				{
					return ThisNode;
				}
				if (node_prev._hnPrevNode === null)
				{
					return node_prev;
				}
				node_prev = node_prev._hnPrevNode;
			}
			else if (RelationshipType === RelationshipTypes.LastNode)
			{
				if (node_next === null)
				{
					return ThisNode;
				}
				if (node_next._hnNextNode === null)
				{
					return node_next;
				}
				node_next = node_next._hnNextNode;
			}
			else if (RelationshipType === RelationshipTypes.RootNode)
			{
				if (node_prev === null)
				{
					return node_root;
				}
				if (node_prev._hnIndent < node_root._hnIndent)
				{
					node_root = node_prev;
				}
				node_prev = node_prev._hnPrevNode;
			}
			else if (RelationshipType === RelationshipTypes.ParentNode)
			{
				if (node_prev === null)
				{
					break;
				}
				if (node_prev._hnIndent < ThisNode._hnIndent)
				{
					return node_prev;
				}
				node_prev = node_prev._hnPrevNode;
			}
			else if (RelationshipType === RelationshipTypes.PrevSibNode)
			{
				if (node_prev === null)
				{
					break;
				}
				if (node_prev._hnIndent < ThisNode._hnIndent)
				{
					break;
				}
				if (node_prev._hnIndent === ThisNode._hnIndent)
				{
					return node_prev;
				}
				node_prev = node_prev._hnPrevNode;
			}
			else if (RelationshipType === RelationshipTypes.NextSibNode)
			{
				if (node_next === null)
				{
					break;
				}
				if (node_next._hnIndent < ThisNode._hnIndent)
				{
					break;
				}
				if (node_next._hnIndent === ThisNode._hnIndent)
				{
					return node_next;
				}
				node_next = node_next._hnNextNode;
			}
			else if (RelationshipType === RelationshipTypes.FirstSibNode)
			{
				if (node_prev === null)
				{
					return node_sib;
				}
				if (node_prev._hnIndent < ThisNode._hnIndent)
				{
					return node_sib;
				}
				if (node_prev._hnIndent === ThisNode._hnIndent)
				{
					node_sib = node_prev;
				}
				node_prev = node_prev._hnPrevNode;
			}
			else if ((RelationshipType === RelationshipTypes.LastSibNode))
			{
				if (node_next === null)
				{
					return node_sib;
				}
				if (node_next._hnIndent < ThisNode._hnIndent)
				{
					return node_sib;
				}
				if (node_next._hnIndent === ThisNode._hnIndent)
				{
					node_sib = node_next;
				}
				node_next = node_next._hnNextNode;
			}
			else if ((RelationshipType === RelationshipTypes.FirstChildNode))
			{
				if (node_next === null)
				{
					break;
				}
				if (node_next._hnIndent <= ThisNode._hnIndent)
				{
					break;
				}
				if (node_next._hnIndent === (ThisNode._hnIndent + 1))
				{
					return node_next;
				}
				node_next = node_next._hnNextNode;
			}
			else if (RelationshipType === RelationshipTypes.LastChildNode)
			{
				if (node_next === null)
				{
					return node_child;
				}
				if (node_next._hnIndent <= ThisNode._hnIndent)
				{
					return node_child;
				}
				if (node_next._hnIndent === (ThisNode._hnIndent + 1))
				{
					node_child = node_next;
				}
				node_next = node_next._hnNextNode;
			}
			else if (RelationshipType === RelationshipTypes.FirstDescNode)
			{
				if (node_next)
				{
					if (node_next._hnIndent > ThisNode._hnIndent)
					{
						return node_next;
					}
				}
				break;
			}
			else if (RelationshipType === RelationshipTypes.LastDescNode)
			{
				if (node_next === null)
				{
					return node_child;
				}
				if (node_next._hnIndent <= ThisNode._hnIndent)
				{
					return node_child;
				}
				if (node_next._hnIndent > ThisNode._hnIndent)
				{
					node_child = node_next;
				}
				node_next = node_next._hnNextNode;
			}
			else
			{
				break;
			}
		}
		return null;
	}


	//=====================================================================
	//=====================================================================
	//          __    ___      ___    __       
	//  \  / | /__` |  |   /\   |  | /  \ |\ | 
	//   \/  | .__/ |  |  /~~\  |  | \__/ | \| 
	//                                         
	//=====================================================================
	//=====================================================================


	//==========================================
	// Enumeration for Node Visitation Types
	var VisitationTypes = {
		AllNodes: 'AllNodes',
		PrevNodes: 'PrevNodes',
		NextNodes: 'NextNodes',
		ParentNodes: 'ParentNodes',
		SiblingNodes: 'SiblingNodes',
		PrevSibNodes: 'PrevSibNodes',
		NextSibNodes: 'NextSibNodes',
		ChildNodes: 'ChildNodes',
		DecendentNodes: 'DecendentNodes',
	};


	//==========================================
	function VisitNodes(ThisNode, NodeVisitor, VisitationType)
	{
		var start_relative = null;
		var next_relative = null;
		var visit_descendents_only = null;

		// Set the visitation parameters.
		if (VisitationType == VisitationTypes.AllNodes)
		{
			start_relative = RelationshipTypes.FirstNode;
			next_relative = RelationshipTypes.NextNode;
		}
		else if (VisitationType == VisitationTypes.PrevNodes)
		{
			start_relative = RelationshipTypes.PrevNode;
			next_relative = RelationshipTypes.PrevNode;
		}
		else if (VisitationType == VisitationTypes.NextNodes)
		{
			start_relative = RelationshipTypes.NextNode;
			next_relative = RelationshipTypes.NextNode;
		}
		else if (VisitationType == VisitationTypes.ParentNodes)
		{
			start_relative = RelationshipTypes.ParentNode;
			next_relative = RelationshipTypes.ParentNode;
		}
		else if (VisitationType == VisitationTypes.SiblingNodes)
		{
			start_relative = RelationshipTypes.FirstSibNode;
			next_relative = RelationshipTypes.NextSibNode;
		}
		else if (VisitationType == VisitationTypes.PrevSibNodes)
		{
			start_relative = RelationshipTypes.PrevSibNode;
			next_relative = RelationshipTypes.PrevSibNode;
		}
		else if (VisitationType == VisitationTypes.NextSibNodes)
		{
			start_relative = RelationshipTypes.NextSibNode;
			next_relative = RelationshipTypes.NextSibNode;
		}
		else if (VisitationType == VisitationTypes.ChildNodes)
		{
			start_relative = RelationshipTypes.FirstChildNode;
			next_relative = RelationshipTypes.NextSibNode;
			visit_descendents_only = true;
		}
		else if (VisitationType == VisitationTypes.DecendentNodes)
		{
			start_relative = RelationshipTypes.FirstChildNode;
			next_relative = RelationshipTypes.NextNode;
			visit_descendents_only = true;
		}
		else
		{
			throw Error("Unknown VisitationType [" + VisitationType + "].");
		}

		// Do the visiting.
		var node = FindRelative(ThisNode, start_relative);
		while (node)
		{
			if (visit_descendents_only && (node._hnIndent <= ThisNode._hnIndent))
			{
				break;
			}
			if (!NodeVisitor.Visit(node))
			{
				break;
			}
			node = FindRelative(node, next_relative);
		}

		// Return the NodeVisitor.
		return NodeVisitor;
	}



	//=====================================================================
	//=====================================================================
	//          __    ___  __   __   __  
	//  \  / | /__` |  |  /  \ |__) /__` 
	//   \/  | .__/ |  |  \__/ |  \ .__/ 
	//                                   
	//=====================================================================
	//=====================================================================


	//==========================================
	/** @constructor */
	function NullVisitor()
	{
		this.Visit = function(Node)
		{
			return true;
		};
	}


	//==========================================
	/** @constructor */
	function CountingVisitor()
	{
		this.Count = 0;
		this.Visit = function(Node)
		{
			this.Count++;
			return true;
		};
	}


	//==========================================
	/** @constructor */
	function CollectingVisitor()
	{
		this.Nodes = [];
		this.Visit = function(Node)
		{
			this.Nodes.push(Node);
			return true;
		};
	}


	//==========================================
	/** @constructor */
	function IndexSelectorVisitor(Index)
	{
		this.Index = Index;
		this.Count = 0;
		this.Node = null;
		this.Visit = function(Node)
		{
			this.Count++;
			if (this.Count > this.Index)
			{
				this.Node = Node;
				return false;
			}
			return true;
		};
	}


	//==========================================
	/** @constructor */
	function PropertySearchVisitor(PropertyName, PropertyValue)
	{
		this.PropertyName = PropertyName;
		this.PropertyValue = PropertyValue;
		this.Nodes = [];
		this.Visit = function(Node)
		{
			if (Node[PropertyName] === PropertyValue)
			{
				this.Nodes.push(Node);
			}
			return true;
		};
	}


	//==========================================
	/** @constructor */
	function PropertySearchFirstVisitor(PropertyName, PropertyValue)
	{
		this.PropertyName = PropertyName;
		this.PropertyValue = PropertyValue;
		this.Node = null;
		this.Visit = function(Node)
		{
			if (Node[PropertyName] === PropertyValue)
			{
				this.Node = Node;
				return false;
			}
			return true;
		};
	}


	//=====================================================================
	//=====================================================================
	//                    ___  ___                 __   ___ 
	//   |\/|  /\  | |\ |  |  |__  |\ |  /\  |\ | /  ` |__  
	//   |  | /~~\ | | \|  |  |___ | \| /~~\ | \| \__, |___ 
	//                                                      
	//=====================================================================
	//=====================================================================


	//==========================================
	function Link(ThisNode, PrevNode, NextNode)
	{
		if (ThisNode._hnPrevNode || ThisNode._hnNextNode)
		{
			throw new Error("This node is already linked.");
		}
		ThisNode._hnPrevNode = PrevNode;
		ThisNode._hnNextNode = NextNode;
		if (ThisNode._hnPrevNode)
		{
			ThisNode._hnPrevNode._hnNextNode = ThisNode;
		}
		if (ThisNode._hnNextNode)
		{
			ThisNode._hnNextNode._hnPrevNode = ThisNode;
		}
		return ThisNode;
	}


	//==========================================
	function Unlink(ThisNode)
	{
		var prev_node = ThisNode._hnPrevNode;
		var next_node = ThisNode._hnNextNode;
		ThisNode._hnPrevNode = null;
		ThisNode._hnNextNode = null;
		if (prev_node)
		{
			prev_node._hnNextNode = next_node;
		}
		if (next_node)
		{
			next_node._hnPrevNode = prev_node;
		}
		return ThisNode;
	}


	//==========================================
	function AddChild(ThisNode, ChildNode = {}, ChildIndex = -1)
	{
		ChildNode = HierNode(ChildNode);

		var prev_node = ThisNode;
		var next_node = ThisNode._hnNextNode;
		while (next_node)
		{
			if (next_node._hnIndent === (ThisNode._hnIndent + 1))
			{
				// A direct child was found.
				if (ChildIndex === 0)
				{
					// This is the child we are looking for. Insert.
					ChildNode._hnIndent = ThisNode._hnIndent + 1;
					ChildNode.Link(prev_node, next_node);
					return ChildNode;
				}
				ChildIndex--;
			}
			else if (next_node._hnIndent <= ThisNode._hnIndent)
			{
				// No more child nodes. Append.
				ChildNode._hnIndent = ThisNode._hnIndent + 1;
				ChildNode.Link(prev_node, next_node);
				return ChildNode;
			}
			prev_node = next_node;
			next_node = next_node._hnNextNode;
		}

		// No more nodes. Append.
		ChildNode._hnIndent = ThisNode._hnIndent + 1;
		ChildNode.Link(prev_node, null);
		return ChildNode;
	}



	//==========================================
	function RemoveChild(ThisNode, ChildIndex)
	{
		var child = HierNodeLib.VisitNodes(
			ThisNode,
			new HierNodeLib.IndexSelectorVisitor(ChildIndex),
			HierNodeLib.VisitationTypes.ChildNodes
		).Node;
		if (child)
		{
			Unlink(child);
		}
		return child;
	}


	//==========================================
	function ClearChildren(ThisNode)
	{
		var children = [];
		var child = RemoveChild(ThisNode, 0);
		while (child)
		{
			children.push(child);
			child = RemoveChild(ThisNode, 0);
		}
		return children;
	}


	//=====================================================================
	//=====================================================================
	//           __   __   ___                      ___  __        __  
	//   |\/| | /__` /  ` |__  |    |     /\  |\ | |__  /  \ |  | /__` 
	//   |  | | .__/ \__, |___ |___ |___ /~~\ | \| |___ \__/ \__/ .__/ 
	//                                                                 
	//=====================================================================
	//=====================================================================


	//==========================================
	function TextGraph(RootNode, TextProperty, IndentText = '\t', EolText = '\n')
	{
		var text_graph = RootNode[TextProperty];
		var next_node = RootNode._hnNextNode;
		while (true)
		{
			if (!next_node)
			{
				break;
			}
			if (next_node._hnIndent <= RootNode._hnIndent)
			{
				break;
			}
			text_graph += EolText;
			for (var index = 1; index <= (next_node._hnIndent - RootNode._hnIndent); index++)
			{
				text_graph += IndentText;
			}
			text_graph += next_node[TextProperty];
			next_node = next_node._hnNextNode;
		}
		return text_graph;
	}


	//=====================================================================
	//=====================================================================
	//          __   __        __               __    
	//  |    | |__) |__)  /\  |__) \ /     /\  |__) | 
	//  |___ | |__) |  \ /~~\ |  \  |     /~~\ |    | 
	//                                                
	//=====================================================================
	//=====================================================================


	var Lib = {};

	// Base Node
	Lib.InitNode = InitNode;
	Lib.PrevNode = PrevNode;
	Lib.NextNode = NextNode;
	Lib.Indent = Indent;

	// Navigation
	Lib.RelationshipTypes = RelationshipTypes;
	Lib.FindRelative = FindRelative;

	// Visitation
	Lib.VisitationTypes = VisitationTypes;
	Lib.VisitNodes = VisitNodes;

	// Visitors
	Lib.NullVisitor = NullVisitor;
	Lib.CountingVisitor = CountingVisitor;
	Lib.CollectingVisitor = CollectingVisitor;
	Lib.IndexSelectorVisitor = IndexSelectorVisitor;
	Lib.PropertySearchVisitor = PropertySearchVisitor;
	Lib.PropertySearchFirstVisitor = PropertySearchFirstVisitor;

	// Maintenance
	Lib.Link = Link;
	Lib.Unlink = Unlink;
	Lib.AddChild = AddChild;
	Lib.RemoveChild = RemoveChild;
	Lib.ClearChildren = ClearChildren;

	// Miscellaneous
	Lib.TextGraph = TextGraph;

	return Lib;
}());


//=====================================================================
//=====================================================================
//          ___  __        __   __   ___     __   __        ___  __  ___ 
//  |__| | |__  |__) |\ | /  \ |  \ |__     /  \ |__)    | |__  /  `  |  
//  |  | | |___ |  \ | \| \__/ |__/ |___    \__/ |__) \__/ |___ \__,  |  
//                                                                       
//=====================================================================
//=====================================================================


//==========================================
// The HierNode Attacher.
// An object oriented wrapper for HierNodeLib.
function HierNode(ThisNode = {})
{
	//------------------------------------------
	// Base Node
	//------------------------------------------

	HierNodeLib.InitNode(ThisNode);

	ThisNode.PrevNode = function()
	{
		return HierNodeLib.PrevNode(this);
	};

	ThisNode.NextNode = function()
	{
		return HierNodeLib.NextNode(this);
	};

	ThisNode.Indent = function()
	{
		return HierNodeLib.Indent(this);
	};

	//------------------------------------------
	// Navigation
	//------------------------------------------

	ThisNode.FindRelative = function(RelationshipType)
	{
		return HierNodeLib.FindRelative(this, RelationshipType);
	};

	ThisNode.FindFirst = function()
	{
		return HierNodeLib.FindRelative(this, HierNodeLib.RelationshipTypes.FirstNode);
	};

	ThisNode.FindLast = function()
	{
		return HierNodeLib.FindRelative(this, HierNodeLib.RelationshipTypes.LastNode);
	};

	ThisNode.FindRoot = function()
	{
		return HierNodeLib.FindRelative(this, HierNodeLib.RelationshipTypes.RootNode);
	};

	ThisNode.FindParent = function()
	{
		return HierNodeLib.FindRelative(this, HierNodeLib.RelationshipTypes.ParentNode);
	};

	ThisNode.FindPrevSibling = function()
	{
		return HierNodeLib.FindRelative(this, HierNodeLib.RelationshipTypes.PrevSibNode);
	};

	ThisNode.FindNextSibling = function()
	{
		return HierNodeLib.FindRelative(this, HierNodeLib.RelationshipTypes.NextSibNode);
	};

	ThisNode.FindFirstSibling = function()
	{
		return HierNodeLib.FindRelative(this, HierNodeLib.RelationshipTypes.FirstSibNode);
	};

	ThisNode.FindLastSibling = function()
	{
		return HierNodeLib.FindRelative(this, HierNodeLib.RelationshipTypes.LastSibNode);
	};

	ThisNode.FindFirstChild = function()
	{
		return HierNodeLib.FindRelative(this, HierNodeLib.RelationshipTypes.FirstChildNode);
	};

	ThisNode.FindLastChild = function()
	{
		return HierNodeLib.FindRelative(this, HierNodeLib.RelationshipTypes.LastChildNode);
	};

	ThisNode.FindFirstDescendent = function()
	{
		return HierNodeLib.FindRelative(this, HierNodeLib.RelationshipTypes.FirstDescNode);
	};

	ThisNode.FindLastDescendent = function()
	{
		return HierNodeLib.FindRelative(this, HierNodeLib.RelationshipTypes.LastDescNode);
	};

	//------------------------------------------
	// Visitation
	//------------------------------------------

	ThisNode.VisitNodes = function(NodeVisitor, VisitationType)
	{
		return HierNodeLib.VisitNodes(this, NodeVisitor, VisitationType);
	};

	ThisNode.VisitAll = function(NodeVisitor)
	{
		return HierNodeLib.VisitNodes(this, NodeVisitor, HierNodeLib.VisitationTypes.PrevNodes);
	};

	ThisNode.VisitPrevious = function(NodeVisitor)
	{
		return HierNodeLib.VisitNodes(this, NodeVisitor, HierNodeLib.VisitationTypes.PrevNodes);
	};

	ThisNode.VisitNext = function(NodeVisitor)
	{
		return HierNodeLib.VisitNodes(this, NodeVisitor, HierNodeLib.VisitationTypes.NextNodes);
	};

	ThisNode.VisitParents = function(NodeVisitor)
	{
		return HierNodeLib.VisitNodes(this, NodeVisitor, HierNodeLib.VisitationTypes.ParentNodes);
	};

	ThisNode.VisitSiblings = function(NodeVisitor)
	{
		return HierNodeLib.VisitNodes(this, NodeVisitor, HierNodeLib.VisitationTypes.SiblingNodes);
	};

	ThisNode.VisitPreviousSiblings = function(NodeVisitor)
	{
		return HierNodeLib.VisitNodes(this, NodeVisitor, HierNodeLib.VisitationTypes.PrevSibNodes);
	};

	ThisNode.VisitNextSiblings = function(NodeVisitor)
	{
		return HierNodeLib.VisitNodes(this, NodeVisitor, HierNodeLib.VisitationTypes.NextSibNodes);
	};

	ThisNode.VisitChildren = function(NodeVisitor)
	{
		return HierNodeLib.VisitNodes(this, NodeVisitor, HierNodeLib.VisitationTypes.ChildNodes);
	};

	ThisNode.VisitDescendents = function(NodeVisitor)
	{
		return HierNodeLib.VisitNodes(this, NodeVisitor, HierNodeLib.VisitationTypes.DecendentNodes);
	};

	//------------------------------------------
	// Scanning
	//------------------------------------------

	ThisNode.ChildCount = function()
	{
		return HierNodeLib.VisitNodes(this, new HierNodeLib.CountingVisitor(), HierNodeLib.VisitationTypes.ChildNodes).Count;
	};

	ThisNode.Children = function()
	{
		return HierNodeLib.VisitNodes(this, new HierNodeLib.CollectingVisitor(), HierNodeLib.VisitationTypes.ChildNodes).Nodes;
	};

	ThisNode.Child = function(ChildIndex)
	{
		return HierNodeLib.VisitNodes(this, new HierNodeLib.IndexSelectorVisitor(ChildIndex), HierNodeLib.VisitationTypes.ChildNodes).Node;
	};

	ThisNode.SearchChildren = function(PropertyName, PropertyValue)
	{
		return HierNodeLib.VisitNodes(this, new HierNodeLib.PropertySearchVisitor(PropertyName, PropertyValue), HierNodeLib.VisitationTypes.ChildNodes).Nodes;
	};

	ThisNode.DescendentCount = function()
	{
		return HierNodeLib.VisitNodes(this, new HierNodeLib.CountingVisitor(), HierNodeLib.VisitationTypes.DecendentNodes).Count;
	};

	ThisNode.Descendents = function()
	{
		return HierNodeLib.VisitNodes(this, new HierNodeLib.CollectingVisitor(), HierNodeLib.VisitationTypes.DecendentNodes).Nodes;
	};

	ThisNode.SearchDescendents = function(PropertyName, PropertyValue)
	{
		return HierNodeLib.VisitNodes(this, new HierNodeLib.PropertySearchVisitor(PropertyName, PropertyValue), HierNodeLib.VisitationTypes.DecendentNodes).Nodes;
	};

	//------------------------------------------
	// Maintenance
	//------------------------------------------

	ThisNode.Link = function(PrevNode, NextNode)
	{
		return HierNodeLib.Link(this, PrevNode, NextNode);
	};

	ThisNode.Unlink = function()
	{
		return HierNodeLib.Unlink(this);
	};

	ThisNode.AddChild = function(Node = null, ChildIndex = -1)
	{
		return HierNodeLib.AddChild(this, Node, ChildIndex);
	};

	ThisNode.RemoveChild = function(ChildIndex)
	{
		return HierNodeLib.RemoveChild(this, ChildIndex);
	};

	ThisNode.ClearChildren = function()
	{
		return HierNodeLib.ClearChildren(this);
	};

	//------------------------------------------
	// Miscellaneous
	//------------------------------------------

	ThisNode.TextGraph = function(TextProperty, IndentText = '\t', EolText = '\n')
	{
		return HierNodeLib.TextGraph(this, TextProperty, IndentText, EolText);
	};

	//------------------------------------------
	// Return the Node.

	return ThisNode;
}


//==========================================
// The HierNode Attacher.
// An object oriented wrapper for HierNodeLib.
function TextNode(ThisText = "")
{
	var node = HierNode(
	{
		Text: ThisText
	});

	node.AddChildText = function(ThisText = "", ChildIndex = -1)
	{
		return HierNodeLib.AddChild(this, TextNode(ThisText), ChildIndex);
	};

	return node;
}


//=====================================================================
//=====================================================================
//         ___  ___  __   __       ___    __       
//  | |\ |  |  |__  / _` |__)  /\   |  | /  \ |\ | 
//  | | \|  |  |___ \__> |  \ /~~\  |  | \__/ | \| 
//                                                 
//=====================================================================
//=====================================================================


//==========================================
// Export public objects for the Closure Compiler.
// see: https://developers.google.com/closure/compiler/docs/api-tutorial3
if (window)
{
	window['HierNodeLib'] = HierNodeLib;
	window['HierNode'] = HierNode;
	window['TextNode'] = TextNode;
}
